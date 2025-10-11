import jwt from 'jsonwebtoken';
import Message from '../mvc/models/message.js';
import User from '../mvc/models/user.js';

// Store connected users
const connectedUsers = new Map();

// Middleware to authenticate socket connections
const authenticateSocket = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        console.log('Socket auth attempt - Token received:', !!token);
        
        if (!token) {
            console.log('Socket auth failed: No token provided');
            return next(new Error('Authentication error: No token provided'));
        }

        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY || 'fallback_secret';
        console.log('Using JWT secret:', jwtSecret === 'fallback_secret' ? 'fallback' : 'from env');
        
        const decoded = jwt.verify(token, jwtSecret);
        console.log('Socket auth successful for user:', decoded.id);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        console.log('Socket auth failed:', error.message);
        next(new Error('Authentication error: Invalid token'));
    }
};

// Initialize Socket.IO handlers
export const initializeSocketHandlers = (io) => {
    // Apply authentication middleware
    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);

        // Store user connection
        connectedUsers.set(socket.userId, socket.id);

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);

        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, productId, content, productTitle } = data;

                // Create message in database
                const message = new Message({
                    sender: socket.userId,
                    receiver: receiverId,
                    product: productId,
                    content,
                    productTitle,
                    timestamp: new Date()
                });

                await message.save();

                // Populate sender information
                await message.populate('sender', 'name email');

                // Send message to receiver if they're online
                const receiverSocketId = connectedUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_message', {
                        message: message,
                        unreadCount: await getUnreadCount(receiverId)
                    });
                }

                // Send confirmation to sender
                socket.emit('message_sent', {
                    message: message,
                    success: true
                });

                // Update unread count for sender
                socket.emit('unread_count_update', {
                    unreadCount: await getUnreadCount(socket.userId)
                });

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message_error', {
                    error: 'Failed to send message'
                });
            }
        });

        // Handle marking messages as read
        socket.on('mark_as_read', async (data) => {
            try {
                const { senderId } = data;

                // Update messages as read
                await Message.updateMany(
                    { 
                        sender: senderId, 
                        receiver: socket.userId, 
                        isRead: false 
                    },
                    { isRead: true }
                );

                // Notify sender that messages were read
                const senderSocketId = connectedUsers.get(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messages_read', {
                        readBy: socket.userId
                    });
                }

                // Update unread count
                const unreadCount = await getUnreadCount(socket.userId);
                socket.emit('unread_count_update', { unreadCount });

            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Handle typing indicators
        socket.on('typing_start', (data) => {
            const { receiverId, conversationId } = data;
            const receiverSocketId = connectedUsers.get(receiverId);
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', {
                    userId: socket.userId,
                    conversationId,
                    isTyping: true
                });
            }
        });

        socket.on('typing_stop', (data) => {
            const { receiverId, conversationId } = data;
            const receiverSocketId = connectedUsers.get(receiverId);
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', {
                    userId: socket.userId,
                    conversationId,
                    isTyping: false
                });
            }
        });

        // Handle user going online/offline
        socket.on('user_online', async () => {
            try {
                // Update user status in database
                await User.findByIdAndUpdate(socket.userId, { 
                    isOnline: true,
                    lastSeen: new Date()
                });

                // Notify all connected users that this user is online
                socket.broadcast.emit('user_status_change', {
                    userId: socket.userId,
                    isOnline: true
                });

            } catch (error) {
                console.error('Error updating user online status:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log(`User ${socket.userId} disconnected`);
            
            try {
                // Remove user from connected users
                connectedUsers.delete(socket.userId);

                // Update user status in database
                await User.findByIdAndUpdate(socket.userId, { 
                    isOnline: false,
                    lastSeen: new Date()
                });

                // Notify all connected users that this user is offline
                socket.broadcast.emit('user_status_change', {
                    userId: socket.userId,
                    isOnline: false
                });

            } catch (error) {
                console.error('Error updating user offline status:', error);
            }
        });
    });
};

// Helper function to get unread message count
const getUnreadCount = async (userId) => {
    try {
        const count = await Message.countDocuments({
            receiver: userId,
            isRead: false
        });
        return count;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
};

// Export connected users map for other modules to use
export { connectedUsers };
