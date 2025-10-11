import messageServices from "./message-services.js";

export const {
    sendMessage,
    getMessagesBetweenUsersService,
    getMessagesByProductService,
    deleteMessage,
    markAsReadService,
    getUnreadCountService,
    getUserConversationsService
} = messageServices;
