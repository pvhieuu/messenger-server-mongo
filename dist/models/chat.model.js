"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const interfaces_1 = require("../interfaces");
const Chat = new mongoose_1.Schema({
    host_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    guest_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    nickname_host: {
        type: String,
        require: false,
    },
    nickname_guest: {
        type: String,
        require: false,
    },
    guest_chat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'chats',
    },
    readed: {
        type: Boolean,
        require: true,
    },
    color: {
        type: String,
        require: true,
        default: interfaces_1.MAIN_COLOR.PRIMARY,
    },
    background_color: {
        type: String,
        require: true,
        default: interfaces_1.BACKGROUND_COLOR.white,
    },
    emoji: {
        type: String,
        require: true,
        default: interfaces_1.MAIN_EMOJI.LIKE,
    },
    last_message_time: {
        type: Date,
        require: true,
        default: (0, moment_1.default)(),
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('chats', Chat);
//# sourceMappingURL=chat.model.js.map