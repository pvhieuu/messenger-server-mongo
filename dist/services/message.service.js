"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const constants_1 = require("../constants");
const messageService = ({ models }) => {
    const { messages } = models;
    const createOne = async (createMessageDto) => await messages.create(createMessageDto);
    const findByChatId = async (chat_id, page) => (await messages
        .find({ chat_id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * constants_1.LIMIT_MESSAGES)
        .limit(constants_1.LIMIT_MESSAGES)).reverse();
    const findLast = async (chat_ids) => messages
        .find({ chat_id: { $in: chat_ids } })
        .sort({ createdAt: -1 })
        .limit(1);
    const deleteByChatId = async (chat_id) => await messages.deleteMany({ chat_id });
    const udpateOneGuestMessageId = async (guest_message_id, message_id) => await messages.findOneAndUpdate({ _id: message_id }, { guest_message_id }, { new: true });
    const updateOneEmoji = async (emoji, message_id) => await messages.findOneAndUpdate({ _id: message_id }, { emoji }, { new: true });
    return {
        createOne,
        findByChatId,
        deleteByChatId,
        udpateOneGuestMessageId,
        updateOneEmoji,
        findLast,
    };
};
exports.messageService = messageService;
//# sourceMappingURL=message.service.js.map