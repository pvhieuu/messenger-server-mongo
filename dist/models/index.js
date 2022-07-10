"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const chat_model_1 = __importDefault(require("./chat.model"));
const message_model_1 = __importDefault(require("./message.model"));
const user_model_1 = __importDefault(require("./user.model"));
const models = () => ({
    users: user_model_1.default,
    chats: chat_model_1.default,
    messages: message_model_1.default,
});
exports.models = models;
//# sourceMappingURL=index.js.map