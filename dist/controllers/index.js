"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = void 0;
const chat_controller_1 = require("./chat.controller");
const message_controller_1 = require("./message.controller");
const user_controller_1 = require("./user.controller");
const controllers = (iCradle) => ({
    userController: (0, user_controller_1.userController)(iCradle),
    chatController: (0, chat_controller_1.chatController)(iCradle),
    messageController: (0, message_controller_1.messageController)(iCradle),
});
exports.controllers = controllers;
//# sourceMappingURL=index.js.map