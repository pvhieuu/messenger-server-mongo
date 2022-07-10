"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.setup = exports.initMongoDB = void 0;
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const sockets_1 = require("./sockets");
const mongoose_1 = require("mongoose");
const initMongoDB = ({ envs }) => {
    (0, mongoose_1.connect)(envs.URI_MONGODB);
    console.log('🚀🚀🚀 MongoDB connected 🚀🚀🚀');
};
exports.initMongoDB = initMongoDB;
const setup = async ({ initMongoDB }) => {
    await initMongoDB;
};
exports.setup = setup;
const startServer = ({ envs, routers }) => {
    const app = (0, express_1.default)();
    const server = (0, http_1.createServer)(app);
    const port = envs.PORT;
    server.listen(port, () => console.log(`--- Server is running on port ${port} ---`));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use(routers);
    (0, sockets_1.sockets)(server);
};
exports.startServer = startServer;
//# sourceMappingURL=configs.js.map