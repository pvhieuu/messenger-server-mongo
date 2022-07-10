"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routers = void 0;
const express_1 = require("express");
const chat_router_1 = require("./chat.router");
const message_router_1 = require("./message.router");
const user_router_1 = require("./user.router");
const routers = (iCradle) => {
    const routers = (0, express_1.Router)();
    routers.use('/user', (0, user_router_1.userRouter)(iCradle));
    routers.use('/chat', (0, chat_router_1.chatRouter)(iCradle));
    routers.use('/message', (0, message_router_1.messageRouter)(iCradle));
    return routers;
};
exports.routers = routers;
//# sourceMappingURL=index.js.map