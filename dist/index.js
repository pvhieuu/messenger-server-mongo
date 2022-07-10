"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("./container");
const main = async () => {
    const container = (0, container_1.initContainer)();
    await container.cradle.setup;
    await container.cradle.startServer;
};
main();
//# sourceMappingURL=index.js.map