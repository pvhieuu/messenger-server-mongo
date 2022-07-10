"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyTokenMiddleware = ({ helpers, envs }) => {
    const { responseHelper } = helpers;
    const verifyAccessToken = (req, res, next) => {
        var _a;
        const accessToken = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!accessToken) {
            return responseHelper.response(res, 401, false, 'Access token not found!');
        }
        try {
            const decoded = (0, jsonwebtoken_1.verify)(accessToken, envs.ACCESS_TOKEN_SECRET);
            req.userId = decoded.userId;
            next();
        }
        catch (error) {
            console.log(error);
            return responseHelper.response(res, 403, false, 'Invalid access token!');
        }
    };
    return {
        verifyAccessToken,
    };
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
//# sourceMappingURL=verifyToken.middleware.js.map