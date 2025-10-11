import {
    createMessage,
    getMessageById,
    findMessageByIdAndUpdate,
    getMessagesBetweenUsers,
    getMessagesByProduct,
    deleteMessageById,
    markMessagesAsRead,
    getUnreadMessageCount,
    getUserConversations
} from "../../database/db.message.js";
import { getIO } from "../../../websocket/io.js";

const sendMessage = async (req) => {
    try {
        const messageData = {
            ...req?.body,
            sender: req?.user?.id
        };
        
        const message = await createMessage(messageData);
        if (message) {
            // Mark previous messages as read when sending a new one
            if (messageData.receiver) {
                await markMessagesAsRead(messageData.receiver, req?.user?.id);
            }
            // Emit realtime events to both participants
            try {
                const io = getIO();
                if (io) {
                    io.to(`user_${messageData.receiver}`).emit('receive_message', { message });
                    io.to(`user_${req?.user?.id}`).emit('message_sent', { message });
                }
            } catch (e) {
                // swallow socket errors
            }
            
            return {
                success: true,
                message: "Message sent successfully",
                statusCode: 201,
                messageData: message
            };
        } else {
            return {
                success: false,
                message: "Failed to send message",
                statusCode: 400,
                messageData: null
            };
        }
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const getMessagesBetweenUsersService = async (req) => {
    try {
        const userId1 = req?.user?.id;
        const userId2 = req?.query?.userId || req?.query?.user;
        const options = {
            page: req?.query?.page || 1,
            limit: req?.query?.limit || 50
        };
        
        if (!userId2) {
            return {
                success: false,
                message: "User ID is required",
                statusCode: 400,
                data: null
            };
        }
        
        const result = await getMessagesBetweenUsers(userId1, userId2, options);
        
        return {
            success: true,
            message: "Messages fetched successfully",
            statusCode: 200,
            data: result
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const getMessagesByProductService = async (req) => {
    try {
        const productId = req?.query?.productId;
        const options = {
            page: req?.query?.page || 1,
            limit: req?.query?.limit || 50
        };
        
        if (!productId) {
            return {
                success: false,
                message: "Product ID is required",
                statusCode: 400,
                data: null
            };
        }
        
        const result = await getMessagesByProduct(productId, options);
        
        return {
            success: true,
            message: "Product messages fetched successfully",
            statusCode: 200,
            data: result
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const deleteMessage = async (req) => {
    try {
        const messageId = req?.query?.id;
        const message = await deleteMessageById(messageId);
        
        if (message) {
            return {
                success: true,
                message: "Message deleted successfully",
                statusCode: 200,
                messageData: message
            };
        } else {
            return {
                success: false,
                message: "Failed to delete message",
                statusCode: 400,
                messageData: null
            };
        }
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const markAsReadService = async (req) => {
    try {
        const senderId = req?.query?.senderId;
        const userId = req?.user?.id;
        
        if (!senderId) {
            return {
                success: false,
                message: "Sender ID is required",
                statusCode: 400,
                data: null
            };
        }
        
        const result = await markMessagesAsRead(userId, senderId);
        
        return {
            success: true,
            message: "Messages marked as read successfully",
            statusCode: 200,
            data: result
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const getUnreadCountService = async (req) => {
    try {
        const userId = req?.user?.id;
        const count = await getUnreadMessageCount(userId);
        
        return {
            success: true,
            message: "Unread count fetched successfully",
            statusCode: 200,
            data: { unreadCount: count }
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

const getUserConversationsService = async (req) => {
    try {
        const userId = req?.user?.id;
        const options = {
            page: req?.query?.page || 1,
            limit: req?.query?.limit || 20
        };
        
        const result = await getUserConversations(userId, options);
        
        return {
            success: true,
            message: "Conversations fetched successfully",
            statusCode: 200,
            data: result
        };
    }
    catch(error) {
        return {
            success: false,
            statusCode: 500,
            message: error.message
        };
    }
}

export default {
    sendMessage,
    getMessagesBetweenUsersService,
    getMessagesByProductService,
    deleteMessage,
    markAsReadService,
    getUnreadCountService,
    getUserConversationsService
}
