import { 
    sendMessage,
    getMessagesBetweenUsersService,
    getMessagesByProductService,
    deleteMessage,
    markAsReadService,
    getUnreadCountService,
    getUserConversationsService
} from "../../services/message/index.js";

const sendMessageController = async (req, res) => {
    try {
        const result = await sendMessage(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.messageData
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getMessagesBetweenUsersController = async (req, res) => {
    try {
        const result = await getMessagesBetweenUsersService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                data: result?.data
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getMessagesByProductController = async (req, res) => {
    try {
        const result = await getMessagesByProductService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                data: result?.data
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteMessageController = async (req, res) => {
    try {
        const result = await deleteMessage(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.messageData
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const markAsReadController = async (req, res) => {
    try {
        const result = await markAsReadService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                data: result?.data
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getUnreadCountController = async (req, res) => {
    try {
        const result = await getUnreadCountService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                data: result?.data
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getUserConversationsController = async (req, res) => {
    try {
        const result = await getUserConversationsService(req);
        if (result?.success) {
            return res.status(result?.statusCode).json({
                success: result?.success,
                data: result?.data
            });
        } else {
            return res.status(result?.statusCode).json({
                success: result?.success,
                message: result?.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const messageController = { 
    sendMessageController,
    getMessagesBetweenUsersController,
    getMessagesByProductController,
    deleteMessageController,
    markAsReadController,
    getUnreadCountController,
    getUserConversationsController
}

export default messageController;
