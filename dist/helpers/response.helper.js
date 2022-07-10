"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHelper = void 0;
const responseHelper = () => {
    const internalServerError = (res) => res.status(500).json({
        status_code: 500,
        success: false,
        message: 'Internal server error!',
        data: null,
    });
    const badRequest = (res, message) => res.status(400).json({
        status_code: 400,
        success: false,
        message,
        data: null,
    });
    const responseSuccess = (res, message, data = null) => res.json({
        status_code: 200,
        success: true,
        message,
        data,
    });
    const response = (res, status_code, success, message, data = null) => res.status(status_code).json({ status_code, success, message, data });
    return {
        internalServerError,
        badRequest,
        responseSuccess,
        response,
    };
};
exports.responseHelper = responseHelper;
//# sourceMappingURL=response.helper.js.map