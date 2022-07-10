"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const chat_service_1 = require("./chat.service");
const message_service_1 = require("./message.service");
const user_service_1 = require("./user.service");
const services = (iCradle) => ({
    userService: (0, user_service_1.userService)(iCradle),
    chatService: (0, chat_service_1.chatService)(iCradle),
    messageService: (0, message_service_1.messageService)(iCradle),
});
exports.services = services;
//# sourceMappingURL=index.js.map