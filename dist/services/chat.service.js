"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const chatService = ({ models }) => {
    const { chats } = models;
    const findOneByHostGuestId = async (host_id, guest_id) => await chats.findOne({ host_id, guest_id });
    const updateOneGuestChatId = async (guest_chat_id, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, { guest_chat_id }, { new: true });
    const createOne = async (createChatDto) => await chats.create(createChatDto);
    const findOneById = async (chat_id) => await chats.findOne({ _id: chat_id });
    const findByHostId = async (host_id) => await chats.find({ host_id }).sort({ last_message_time: -1 });
    const deleteOne = async (chat_id, host_id) => await chats.findOneAndDelete({ _id: chat_id, host_id });
    const updateOneReaded = async (chat_id, readed) => await chats.findOneAndUpdate({ _id: chat_id }, { readed }, { new: true });
    const updateOneNickname = async (data, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, data, { new: true });
    const updateOneColor = async (color, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, { color }, { new: true });
    const updateOneBackgroundColor = async (background_color, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, { background_color }, { new: true });
    const updateOneEmoji = async (emoji, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, { emoji }, { new: true });
    const updateOneLastMessageTime = async (last_message_time, chat_id) => await chats.findOneAndUpdate({ _id: chat_id }, { last_message_time }, { new: true });
    return {
        findOneByHostGuestId,
        updateOneGuestChatId,
        createOne,
        findByHostId,
        deleteOne,
        findOneById,
        updateOneReaded,
        updateOneNickname,
        updateOneColor,
        updateOneBackgroundColor,
        updateOneEmoji,
        updateOneLastMessageTime,
    };
};
exports.chatService = chatService;
//# sourceMappingURL=chat.service.js.map