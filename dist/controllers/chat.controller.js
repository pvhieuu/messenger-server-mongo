"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const constants_1 = require("../constants");
const lodash_1 = __importDefault(require("lodash"));
const chatController = ({ helpers, services }) => {
    const { responseHelper } = helpers;
    const { chatService, messageService, userService } = services;
    const createNewChat = async (req, res) => {
        const guestId = lodash_1.default.trim(req.body.guest_id);
        if (guestId === req.userId)
            return responseHelper.badRequest(res, 'Cannot create a new chat!');
        try {
            const existingHostChat = await chatService.findOneByHostGuestId(req.userId, guestId);
            if (existingHostChat)
                return responseHelper.badRequest(res, 'Chat room already exists!');
            const existingGuestChat = await chatService.findOneByHostGuestId(guestId, req.userId);
            const guestChatId = existingGuestChat ? existingGuestChat._id : null;
            const newChat = await chatService.createOne({
                host_id: req.userId,
                guest_id: guestId,
                guest_chat_id: guestChatId,
                readed: true,
                nickname_host: (existingGuestChat === null || existingGuestChat === void 0 ? void 0 : existingGuestChat.nickname_guest) || null,
                nickname_guest: (existingGuestChat === null || existingGuestChat === void 0 ? void 0 : existingGuestChat.nickname_host) || null,
                color: (existingGuestChat === null || existingGuestChat === void 0 ? void 0 : existingGuestChat.color) || '#0a7cff',
                background_color: (existingGuestChat === null || existingGuestChat === void 0 ? void 0 : existingGuestChat.background_color) || '#fff',
                emoji: (existingGuestChat === null || existingGuestChat === void 0 ? void 0 : existingGuestChat.emoji) || 'fas fa-thumbs-up',
            });
            const hostInfo = await userService.findOneById(newChat.host_id);
            const guestInfo = await userService.findOneById(newChat.guest_id);
            const lastMessage = [];
            const newChatInfo = Object.assign(Object.assign({}, newChat._doc), { host: hostInfo, guest: guestInfo, last_message: lastMessage });
            if (existingGuestChat) {
                await chatService.updateOneGuestChatId(newChat._id, existingGuestChat._id);
            }
            return responseHelper.responseSuccess(res, 'Create a new chat successfully', { new_chat: newChatInfo });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const getListChats = async (req, res) => {
        var _a, _b;
        try {
            const listChats = await chatService.findByHostId(req.userId);
            if (!listChats || !listChats.length)
                return responseHelper.responseSuccess(res, 'Get list chats successfully', { list_chats: [] });
            const hostInfo = await userService.findOneById(listChats[0].host_id);
            const listGuestIds = [];
            const listChatIds = [];
            for (const chat of listChats) {
                listGuestIds.push(chat.guest_id);
                listChatIds.push(chat._id);
            }
            const listGuestInfo = await userService.findByIds(listGuestIds);
            const memorizeGuestInfo = {};
            for (const guestInfo of listGuestInfo) {
                memorizeGuestInfo[guestInfo._id.toString()] = guestInfo;
            }
            const listLastMessages = await messageService.findLast(listChatIds);
            const memorizeLastMessage = {};
            for (const lastMessage of listLastMessages) {
                if (lastMessage.chat_id) {
                    memorizeLastMessage[(_a = lastMessage.chat_id) === null || _a === void 0 ? void 0 : _a.toString()] = lastMessage;
                }
            }
            const listChatsInfo = [];
            for (const chat of listChats) {
                listChatsInfo.push(Object.assign(Object.assign({}, chat._doc), { host: hostInfo, guest: chat.guest_id
                        ? memorizeGuestInfo[(_b = chat.guest_id) === null || _b === void 0 ? void 0 : _b.toString()]
                        : null, last_message: memorizeLastMessage[chat._id.toString()]
                        ? [memorizeLastMessage[chat._id.toString()]]
                        : [] }));
            }
            return responseHelper.responseSuccess(res, 'Get list chats successfully', { list_chats: listChatsInfo });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const deleteChat = async (req, res) => {
        const chatId = lodash_1.default.trim(req.query.chat_id);
        const guestId = lodash_1.default.trim(req.query.guest_id);
        let guestChatId = lodash_1.default.trim(req.query.guest_chat_id);
        if (!guestChatId || guestChatId === 'null') {
            guestChatId = null;
        }
        try {
            const deletedChat = await chatService.deleteOne(chatId, req.userId);
            if (!deletedChat)
                return responseHelper.badRequest(res, 'Cannot delete chat room!');
            await messageService.deleteByChatId(chatId);
            if (guestChatId) {
                await chatService.updateOneGuestChatId(null, guestChatId);
            }
            return responseHelper.responseSuccess(res, 'Delete chat successfully', {
                deleted_chat: deletedChat,
                chat_id: chatId,
                guest_chat_id: guestChatId,
                guest_id: guestId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateReaded = async (req, res) => {
        var _a;
        const chat_id = (_a = req.body.chat_id) === null || _a === void 0 ? void 0 : _a.trim();
        try {
            await chatService.updateOneReaded(chat_id, true);
            return responseHelper.responseSuccess(res, 'Update readed successfully', {
                chat_id,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateNickname = async (req, res) => {
        const updateNicknameDto = req.body;
        const chatId = updateNicknameDto.chat_id;
        let guestChatId = updateNicknameDto.guest_chat_id;
        const guestId = updateNicknameDto.guest_id;
        try {
            await chatService.updateOneNickname(updateNicknameDto.data, chatId);
            await chatService.updateOneNickname({
                nickname_host: updateNicknameDto.data.nickname_guest,
                nickname_guest: updateNicknameDto.data.nickname_host,
            }, guestChatId);
            return responseHelper.responseSuccess(res, 'Update nickname successfully', {
                updated_nickname: updateNicknameDto.data,
                guest_id: guestId,
                guest_chat_id: guestChatId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateColor = async (req, res) => {
        var _a, _b, _c, _d;
        const color = ((_a = req.body.color) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const chatId = ((_b = req.body.chat_id) === null || _b === void 0 ? void 0 : _b.trim()) || null;
        const guestId = ((_c = req.body.guest_id) === null || _c === void 0 ? void 0 : _c.trim()) || null;
        let guestChatId = ((_d = req.body.guest_chat_id) === null || _d === void 0 ? void 0 : _d.trim()) || null;
        if (!chatId || !guestId || !color)
            return responseHelper.badRequest(res, 'Cannot update color!');
        if (!constants_1.MAIN_COLORS.includes(color))
            return responseHelper.badRequest(res, 'Invalid color!');
        try {
            await chatService.updateOneColor(color, chatId);
            await chatService.updateOneColor(color, guestChatId);
            return responseHelper.responseSuccess(res, 'Change color successfully', {
                color,
                guest_chat_id: guestChatId,
                guest_id: guestId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateBackgroundColor = async (req, res) => {
        var _a, _b, _c, _d;
        const backgroundColor = ((_a = req.body.background_color) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const chatId = ((_b = req.body.chat_id) === null || _b === void 0 ? void 0 : _b.trim()) || null;
        const guestId = ((_c = req.body.guest_id) === null || _c === void 0 ? void 0 : _c.trim()) || null;
        let guestChatId = ((_d = req.body.guest_chat_id) === null || _d === void 0 ? void 0 : _d.trim()) || null;
        if (!chatId || !guestId || !backgroundColor)
            return responseHelper.badRequest(res, 'Cannot update color!');
        if (!constants_1.BACKGROUND_COLORS.includes(backgroundColor))
            return responseHelper.badRequest(res, 'Invalid color!');
        try {
            await chatService.updateOneBackgroundColor(backgroundColor, chatId);
            await chatService.updateOneBackgroundColor(backgroundColor, guestChatId);
            return responseHelper.responseSuccess(res, 'Change background color successfully', {
                background_color: backgroundColor,
                guest_chat_id: guestChatId,
                guest_id: guestId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateEmoji = async (req, res) => {
        var _a, _b, _c, _d;
        const emoji = ((_a = req.body.emoji) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        const chatId = ((_b = req.body.chat_id) === null || _b === void 0 ? void 0 : _b.trim()) || null;
        const guestId = ((_c = req.body.guest_id) === null || _c === void 0 ? void 0 : _c.trim()) || null;
        let guestChatId = ((_d = req.body.guest_chat_id) === null || _d === void 0 ? void 0 : _d.trim()) || null;
        if (!chatId || !guestId || !emoji)
            return responseHelper.badRequest(res, 'Cannot update emoji!');
        if (!constants_1.MAIN_EMOJIS.includes(emoji))
            return responseHelper.badRequest(res, 'Invalid emoji!');
        try {
            await chatService.updateOneEmoji(emoji, chatId);
            await chatService.updateOneEmoji(emoji, guestChatId);
            return responseHelper.responseSuccess(res, 'Change emoji successfully', {
                emoji,
                guest_chat_id: guestChatId,
                guest_id: guestId,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    return {
        createNewChat,
        getListChats,
        deleteChat,
        updateReaded,
        updateNickname,
        updateColor,
        updateBackgroundColor,
        updateEmoji,
    };
};
exports.chatController = chatController;
//# sourceMappingURL=chat.controller.js.map