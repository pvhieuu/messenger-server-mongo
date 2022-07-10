"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const argon2_1 = require("argon2");
const jsonwebtoken_1 = require("jsonwebtoken");
const lodash_1 = __importDefault(require("lodash"));
const userController = ({ helpers, services, envs }) => {
    const { responseHelper, convertHelper } = helpers;
    const { userService } = services;
    const registerNewUser = async (req, res) => {
        const phoneOrEmail = lodash_1.default.trim(req.body.phone_or_email);
        const password = lodash_1.default.trim(req.body.password);
        const fullname = lodash_1.default.trim(req.body.fullname);
        try {
            const existingUser = req.type === 'email'
                ? await userService.findOneByEmail(phoneOrEmail)
                : await userService.findOneByPhoneNum(phoneOrEmail);
            if (existingUser)
                return responseHelper.badRequest(res, `${req.type === 'email' ? 'Email' : 'Phone number'} already exists, please choose another one!`);
            const hashedPassword = await (0, argon2_1.hash)(`${password}${envs.ENCRYPT_PASSWORD}`);
            const createNewUser = (phone_number, email) => ({
                phone_number,
                email,
                password: hashedPassword,
                fullname,
                fresh_name: convertHelper.removeAccents(fullname),
            });
            await userService.createOne(req.type === 'email'
                ? createNewUser(null, phoneOrEmail)
                : createNewUser(phoneOrEmail, null));
            return responseHelper.responseSuccess(res, 'Successful account registration');
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const loginAccountUser = async (req, res) => {
        const phoneOrEmail = lodash_1.default.trim(req.body.phone_or_email);
        const password = lodash_1.default.trim(req.body.password);
        try {
            const existingUser = req.type === 'email'
                ? await userService.findOneByEmail(phoneOrEmail)
                : await userService.findOneByPhoneNum(phoneOrEmail);
            if (!existingUser)
                return responseHelper.badRequest(res, `${req.type === 'email' ? 'Email' : 'Phone number'} or password incorrect, please try again!`);
            const verifyPassword = await (0, argon2_1.verify)(existingUser.password, `${password}${envs.ENCRYPT_PASSWORD}`);
            if (!verifyPassword)
                return responseHelper.badRequest(res, `${req.type === 'email' ? 'Email' : 'Phone number'} or password incorrect, please try again!`);
            const accessToken = (0, jsonwebtoken_1.sign)({ userId: existingUser._id }, envs.ACCESS_TOKEN_SECRET);
            return responseHelper.responseSuccess(res, 'Logged in successfully', {
                access_token: accessToken,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const logoutAccountUser = async (req, res) => {
        try {
            await userService.updateOneStatusOnline(false, req.userId);
            await userService.updateOneLastLogout(req.userId);
            return responseHelper.responseSuccess(res, 'Log out account successfully');
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const changeAvatar = async (req, res) => {
        var _a;
        const newAvatar = ((_a = req.body.new_avatar) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        try {
            const updatedUser = await userService.updateOneAvatar(newAvatar, req.userId);
            return responseHelper.responseSuccess(res, 'Update new avatar successfully', { new_avatar: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.avatar });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const getMyInfo = async (req, res) => {
        try {
            const myInfo = await userService.findOneById(req.userId);
            return responseHelper.responseSuccess(res, 'Get my info successfully', {
                my_info: myInfo,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const searchUsers = async (req, res) => {
        var _a;
        let pattern = ((_a = req.query.pattern) === null || _a === void 0 ? void 0 : _a.trim()) || null;
        if (!pattern)
            return responseHelper.badRequest(res, 'Pattern is required!');
        pattern = convertHelper.removeAccents(pattern);
        try {
            const listUsers = await userService.findByPattern(pattern);
            return responseHelper.responseSuccess(res, 'Search users successfully', {
                list_users: listUsers,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    const updateStatusOnline = async (req, res) => {
        const statusOnline = req.body.status_online;
        try {
            await userService.updateOneStatusOnline(statusOnline, req.userId);
            return responseHelper.responseSuccess(res, 'Update status online successfully', {
                status_online: statusOnline,
            });
        }
        catch (error) {
            console.log(error);
            return responseHelper.internalServerError(res);
        }
    };
    return {
        registerNewUser,
        loginAccountUser,
        logoutAccountUser,
        changeAvatar,
        getMyInfo,
        searchUsers,
        updateStatusOnline,
    };
};
exports.userController = userController;
//# sourceMappingURL=user.controller.js.map