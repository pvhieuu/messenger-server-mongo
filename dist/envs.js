"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envs = () => ({
    NODE_ENV: process.env.NODE_ENV || '',
    PORT: process.env.PORT ? +process.env.PORT : 4000,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
    ENCRYPT_PASSWORD: process.env.ENCRYPT_PASSWORD || '',
    URI_MONGODB: process.env.URI_MONGODB || '',
});
exports.envs = envs;
//# sourceMappingURL=envs.js.map