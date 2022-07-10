"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlwares = void 0;
const validate_middleware_1 = require("./validate.middleware");
const verifyToken_middleware_1 = require("./verifyToken.middleware");
const middlwares = (iCradle) => ({
    validateMiddlewares: (0, validate_middleware_1.validateMiddlewares)(iCradle),
    verifyTokenMiddleware: (0, verifyToken_middleware_1.verifyTokenMiddleware)(iCradle),
});
exports.middlwares = middlwares;
//# sourceMappingURL=index.js.map