"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("./inits/global");
const app_1 = require("./app");
(async () => {
    await global_1.globInit();
    let port = process.env.PORT || G.CONFIGS.port;
    try {
        let app = await app_1.default.init();
        app.listen(port, () => {
            G.logger.info(`current running environment is ${G.NODE_ENV}`);
            G.logger.info(`✅ 启动地址 http://127.0.0.1:${port}`);
        });
    }
    catch (e) {
        G.logger.error(e);
    }
})();
//# sourceMappingURL=index.js.map