"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContainer = void 0;
const awilix_1 = require("awilix");
const configs_1 = require("./configs");
const controllers_1 = require("./controllers");
const envs_1 = require("./envs");
const helpers_1 = require("./helpers");
const middlewares_1 = require("./middlewares");
const routers_1 = require("./routers");
const services_1 = require("./services");
const models_1 = require("./models");
const initContainer = () => (0, awilix_1.createContainer)().register({
    envs: (0, awilix_1.asFunction)(envs_1.envs).singleton(),
    initMongoDB: (0, awilix_1.asFunction)(configs_1.initMongoDB).singleton(),
    setup: (0, awilix_1.asFunction)(configs_1.setup).singleton(),
    startServer: (0, awilix_1.asFunction)(configs_1.startServer).singleton(),
    routers: (0, awilix_1.asFunction)(routers_1.routers).singleton(),
    helpers: (0, awilix_1.asFunction)(helpers_1.helpers).singleton(),
    middlwares: (0, awilix_1.asFunction)(middlewares_1.middlwares).singleton(),
    controllers: (0, awilix_1.asFunction)(controllers_1.controllers).singleton(),
    services: (0, awilix_1.asFunction)(services_1.services).singleton(),
    models: (0, awilix_1.asFunction)(models_1.models).singleton(),
});
exports.initContainer = initContainer;
//# sourceMappingURL=container.js.map