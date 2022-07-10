"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const moment_1 = __importDefault(require("moment"));
const userService = ({ models }) => {
    const { users } = models;
    const findOneByPhoneNum = async (phone_number) => await users.findOne({ phone_number });
    const findOneByEmail = async (email) => await users.findOne({ email });
    const createOne = async (createUserDto) => await users.create(createUserDto);
    const updateOneStatusOnline = async (status_online, user_id) => await users.findOneAndUpdate({ _id: user_id }, { status_online }, { new: true });
    const updateOneLastLogout = async (user_id) => await users.findOneAndUpdate({ _id: user_id }, { last_logout: (0, moment_1.default)() }, { new: true });
    const updateOneAvatar = async (new_avatar, user_id) => await users.findOneAndUpdate({ _id: user_id }, { avatar: new_avatar }, { new: true });
    const findOneById = async (user_id) => await users.findOne({ _id: user_id }, {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
    });
    const findByPattern = async (pattern) => await users.find({
        $or: [
            { phone_number: { $regex: pattern } },
            { email: { $regex: pattern } },
            { fresh_name: { $regex: pattern } },
        ],
    }, {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
    });
    const findByIds = async (user_ids) => await users.find({ _id: { $in: user_ids } }, {
        phone_number: false,
        email: false,
        password: false,
        createdAt: false,
        updatedAt: false,
    });
    return {
        findOneByPhoneNum,
        findOneByEmail,
        createOne,
        updateOneStatusOnline,
        updateOneLastLogout,
        updateOneAvatar,
        findOneById,
        findByPattern,
        findByIds,
    };
};
exports.userService = userService;
//# sourceMappingURL=user.service.js.map