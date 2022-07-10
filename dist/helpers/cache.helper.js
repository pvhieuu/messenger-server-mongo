"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheHelper = void 0;
const cacheHelper = () => {
    const listUsersSearchedByPattern = (pattern) => pattern
        ? `list users searched by pattern: ${pattern}`
        : 'list users searched by pattern:*';
    const infoOfUser = (user_id) => `info of user: ${user_id}`;
    const listChatsOfUser = (user_id) => user_id ? `list chats of user: ${user_id}` : 'list chats of user:*';
    const listMessagesOfChat = (chat_id) => `list messages of chat: ${chat_id}*`;
    const listMessagesOfChatOfPage = (chat_id, page) => `list messages of chat: ${chat_id} of page: ${page}`;
    return {
        listUsersSearchedByPattern,
        infoOfUser,
        listChatsOfUser,
        listMessagesOfChat,
        listMessagesOfChatOfPage,
    };
};
exports.cacheHelper = cacheHelper;
//# sourceMappingURL=cache.helper.js.map