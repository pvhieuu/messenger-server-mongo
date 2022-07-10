"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chatRouter = ({ middlwares, controllers }) => {
    const routers = (0, express_1.Router)();
    const { verifyAccessToken } = middlwares.verifyTokenMiddleware;
    const { chatController } = controllers;
    routers.post('/create', verifyAccessToken, chatController.createNewChat);
    routers.get('/get', verifyAccessToken, chatController.getListChats);
    routers.delete('/delete', verifyAccessToken, chatController.deleteChat);
    routers.patch('/read', verifyAccessToken, chatController.updateReaded);
    routers.patch('/nickname', verifyAccessToken, chatController.updateNickname);
    routers.patch('/color', verifyAccessToken, chatController.updateColor);
    routers.patch('/emoji', verifyAccessToken, chatController.updateEmoji);
    routers.patch('/background_color', verifyAccessToken, chatController.updateBackgroundColor);
    return routers;
};
exports.chatRouter = chatRouter;
//# sourceMappingURL=chat.router.js.map