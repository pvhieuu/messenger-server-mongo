"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = require("express");
const messageRouter = ({ middlwares, controllers }) => {
    const routers = (0, express_1.Router)();
    const { verifyAccessToken } = middlwares.verifyTokenMiddleware;
    const { messageController } = controllers;
    routers.post('/send', verifyAccessToken, messageController.sendMessage);
    routers.get('/get', verifyAccessToken, messageController.getListMessages);
    routers.patch('/emoji', verifyAccessToken, messageController.updateEmoji);
    return routers;
};
exports.messageRouter = messageRouter;
//# sourceMappingURL=message.router.js.map