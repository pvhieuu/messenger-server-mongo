"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userRouter = ({ middlwares, controllers }) => {
    const routers = (0, express_1.Router)();
    const { validateMiddlewares, verifyTokenMiddleware } = middlwares;
    const { userController } = controllers;
    routers.post('/register', validateMiddlewares.validateRegisterInput, userController.registerNewUser);
    routers.post('/login', validateMiddlewares.validateLoginInput, userController.loginAccountUser);
    routers.patch('/logout', verifyTokenMiddleware.verifyAccessToken, userController.logoutAccountUser);
    routers.patch('/avatar', verifyTokenMiddleware.verifyAccessToken, userController.changeAvatar);
    routers.get('/me', verifyTokenMiddleware.verifyAccessToken, userController.getMyInfo);
    routers.get('/search', verifyTokenMiddleware.verifyAccessToken, userController.searchUsers);
    routers.patch('/status_online', verifyTokenMiddleware.verifyAccessToken, userController.updateStatusOnline);
    return routers;
};
exports.userRouter = userRouter;
//# sourceMappingURL=user.router.js.map