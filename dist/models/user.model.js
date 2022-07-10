"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    phone_number: {
        type: String,
        require: false,
    },
    email: {
        type: String,
        require: false,
    },
    password: {
        type: String,
        require: true,
    },
    fullname: {
        type: String,
        require: true,
    },
    fresh_name: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        require: false,
        maxLength: 6000,
    },
    status_online: {
        type: Boolean,
        require: true,
        default: false,
    },
    last_logout: {
        type: Date,
        require: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('users', User);
//# sourceMappingURL=user.model.js.map