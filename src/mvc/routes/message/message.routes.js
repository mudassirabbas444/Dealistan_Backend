import express from "express";
import messageController from "../../controllers/message/message.controller.js";
import { messageRoutes } from "../routes-strings.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Send message (requires authentication)
router.post(messageRoutes.SEND_MESSAGE, auth, messageController.sendMessageController);

// Get messages between users (requires authentication)
router.get(messageRoutes.GET_MESSAGES_BETWEEN_USERS, auth, messageController.getMessagesBetweenUsersController);

// Get messages by product (requires authentication)
router.get(messageRoutes.GET_MESSAGES_BY_PRODUCT, auth, messageController.getMessagesByProductController);

// Delete message (requires authentication)
router.delete(messageRoutes.DELETE_MESSAGE, auth, messageController.deleteMessageController);

// Mark messages as read (requires authentication)
router.patch(messageRoutes.MARK_AS_READ, auth, messageController.markAsReadController);

// Get unread message count (requires authentication)
router.get(messageRoutes.GET_UNREAD_COUNT, auth, messageController.getUnreadCountController);

// Get user conversations (requires authentication)
router.get(messageRoutes.GET_USER_CONVERSATIONS, auth, messageController.getUserConversationsController);

export { router as messageRouter };
