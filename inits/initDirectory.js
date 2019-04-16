"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdirp = require("mkdirp");
exports.default = {
    async init(app) {
        const initDirs = G.CONFIGS.inits.directory.dirs;
        for (let dir of initDirs) {
            let dirPath = `${G.ROOT_PATH}/${dir}`;
            const exists = fs.existsSync(dirPath);
            if (!exists) {
                mkdirp.sync(dirPath);
                G.logger.debug(`make directory ${dirPath} `);
            }
        }
    }
};
//# sourceMappingURL=initDirectory.js.map