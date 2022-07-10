"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const interfaces_1 = require("../interfaces");
const constants_1 = require("../constants");
const lodash_1 = __importDefault(require("lodash"));
const messageController = ({ helpers, services }) => {
    const { responseHelper } = helpers;
    const { chatService, messageService } = services;
    const sendMessage = async (req, res) => {
        var _a, _b, _c;
        const content = lodash_1.default.trim(req.body.content);
        const type = lodash_1.default.trim(req.body.type);
        const chatId = lodash_1.default.trim(req.body.chat_id);
        const guestId = lodash_1.default.trim(req.body.guest_id);
        let guestChatId = ((_a = req.body.guest_chat_id) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const nicknameHost = ((_b = req.body.nickname_host) === null || _b === void 0 ? void 0 : _b.trim()) || null;
        const nicknameGuest = ((_c = req.body.nickname_guest) === null || _c === void 0 ? void 0 : _c.trim()) || null;
        const color = req.body.color;
        const emoji = req.body.emoji;
        const backgroundColor = req.body.background_color;
        if (!content ||
            ![
                interfaces_1.TYPE_MESSAGE.TEXT,
                interfaces_1.TYPE_MESSAGE.ICON,
                interfaces_1.TYPE_MESSAGE.IMAGE,
                interfaces_1.TYPE_MESSAGE.VOICE,
                interfaces_1.TYPE_MESSAGE.VIDEO,
                interfaces_1.TYPE_MESSAGE.CONFIG,
            ].includes(type) ||
            !chatId ||
            !guestId)
            return responseHelper.badRequest(res, 'Invalid data!');
        if (guestId === req.userId)
            return responseHelper.badRequest(res, 'Cannot send message!');
        try {
            let newGuestChat = null;
            if (lodash_1.default.isNil(guestChatId)) {
                newGuestChat = await chatService.createOne({
                    host_id: guestId,
                    guest_id: req.userId,
                    guest_chat_id: chatId,
                    readed: true,
                    nickname_host: nicknameGuest,
                    nickname_guest: nicknameHost,
                    color,
                    background_color: backgroundColor,
                    emoji,
                });
                guestChatId = newGuestChat._id;
                await chatService.updateOneGuestChatId(guestChatId, chatId);
            }
            const createNewMessage = (chat_id) => ({
                content,
                type,
                sender_id: req.userId,
                receiver_id: guestId,
                chat_id,
                guest_message_id: null,
            });
            const newMessage = await messageService.createOne(createNewMessage(chatId));
            const newGuestMessage = await messageService.createOne(createNewMessage(guestChatId));
            await messageService.udpateOneGuestMessageId(newGuestMessage._id, newMessage._id);
            await messageService.udpateOneGuestMessageId(newMessage._id, newGuestMessage._id);
            await chatService.updateOneLastMessageTime(newMessage.createdAt, chatId);
            await chatService.updateOneLastMessageTime(newGuestMessage.createdAt, guestChatId);
            await chatService.updateOneReaded(guestChatId, false);
            newGuestChat =
                newGuestChat && (await chatService.findOneById(newGuestChat._id));
            return responseHelper.responseSuccess(res, 'Send message successfully', {
                new_message: newMessage,
                new_guest_message: newGuestMessage,
                new_guest_chat: newGuestChat,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const getListMessages = async (req, res) => {
        var _a;
        const chatId = ((_a = req.query.chat_id) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const page = req.query.page;
        try {
            const listMessages = await messageService.findByChatId(chatId, page);
            return responseHelper.responseSuccess(res, 'Get list messages successfully', { list_messages: listMessages });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateEmoji = async (req, res) => {
        var _a, _b, _c;
        const emoji = ((_a = req.body.emoji) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const messageId = (_b = req.body.message_id) === null || _b === void 0 ? void 0 : _b.trim();
        const guestMessageId = ((_c = req.body.guest_message_id) === null || _c === void 0 ? void 0 : _c.trim()) || null;
        if (!constants_1.MESSAGE_EMOJIS.includes(emoji))
            return responseHelper.badRequest(res, 'Invalid emoji!');
        try {
            await messageService.updateOneEmoji(emoji, messageId);
            await messageService.updateOneEmoji(emoji, guestMessageId);
            return responseHelper.responseSuccess(res, 'Update emoji successfully', {
                emoji,
                message_id: messageId,
                guest_message_id: guestMessageId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    return {
        sendMessage,
        getListMessages,
        updateEmoji,
    };
};
exports.messageController = messageController;
//# sourceMappingURL=message.controller.js.map