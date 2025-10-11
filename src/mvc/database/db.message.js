import Message from "../models/message.js";
import mongoose from "mongoose";

export const createMessage = async (messageData) => {
    try {
        const message = new Message(messageData);
        return await message.save();
    }
    catch(error) {
        throw new Error("Error creating message: " + error.message);
    }
}

export const getMessageById = async (messageId) => {
    try {
        return await Message.findById(messageId)
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .populate("product", "title price");
    }
    catch(error) {
        throw new Error("Error fetching message: " + error.message);
    }
}

export const findMessageByIdAndUpdate = async (messageId, updateData) => {
    try {
        const message = await Message.findByIdAndUpdate(messageId, updateData, { new: true })
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .populate("product", "title price");
        
        if (!message) {
            throw new Error("Message not found");
        }
        return message;
    }
    catch(error) {
        throw new Error("Error updating message: " + error.message);
    }
}

export const getMessagesBetweenUsers = async (userId1, userId2, options) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Get messages where either user is sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        })
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .populate("product", "title price")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Message.countDocuments({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        });
        
        return {
            messages,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    catch(error) {
        throw new Error("Error fetching messages between users: " + error.message);
    }
}

export const getMessagesByProduct = async (productId, options) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 50;
        const skip = (page - 1) * limit;
        
        const messages = await Message.find({ product: productId })
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .populate("product", "title price")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Message.countDocuments({ product: productId });
        
        return {
            messages,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    catch(error) {
        throw new Error("Error fetching messages by product: " + error.message);
    }
}

export const deleteMessageById = async (messageId) => {
    try {
        const message = await Message.findByIdAndDelete(messageId);
        if (!message) {
            throw new Error("Message not found");
        }
        return message;
    }
    catch(error) {
        throw new Error("Error deleting message: " + error.message);
    }
}

export const markMessagesAsRead = async (userId, senderId) => {
    try {
        const result = await Message.updateMany(
            { receiver: userId, sender: senderId, isRead: false },
            { isRead: true }
        );
        return result;
    }
    catch(error) {
        throw new Error("Error marking messages as read: " + error.message);
    }
}

export const getUnreadMessageCount = async (userId) => {
    try {
        const count = await Message.countDocuments({
            receiver: userId,
            isRead: false
        });
        return count;
    }
    catch(error) {
        throw new Error("Error getting unread message count: " + error.message);
    }
}

export const getUserConversations = async (userId, options) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 20;
        const skip = (page - 1) * limit;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Get unique conversations for a user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userObjectId },
                        { receiver: userObjectId }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "_id",
                    as: "receiverInfo"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", userObjectId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $last: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$receiver", userObjectId] }, { $eq: ["$isRead", false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "otherUserInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    unreadCount: 1,
                    otherUser: { $arrayElemAt: ["$otherUserInfo", 0] }
                }
            },
            {
                $sort: { "lastMessage.createdAt": -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
        
        return {
            conversations,
            total: conversations.length,
            page,
            pages: Math.ceil(conversations.length / limit)
        };
    }
    catch(error) {
        throw new Error("Error getting user conversations: " + error.message);
    }
}
