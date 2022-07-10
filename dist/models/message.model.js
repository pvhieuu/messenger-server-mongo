"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants");
const Message = new mongoose_1.Schema({
    content: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        enum: constants_1.TYPE_MESSAGES,
        require: true,
    },
    sender_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    receiver_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    chat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'chats',
    },
    guest_message_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'messages',
    },
    emoji: {
        type: String,
        require: true,
        default: null,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('messages', Message);
//# sourceMappingURL=message.model.js.map