"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let requireDir = require('require-dir');
class Startup {
    async init(app) {
        const inits = [];
        let dirData = requireDir(__dirname);
        G.L.each(dirData, (item, name) => {
            let initOp = name.length > 4 && name.substr(4).toLowerCase();
            if (initOp && G.CONFIGS.inits[initOp] && G.CONFIGS.inits[initOp].run &&
                name.match(/^init/) && item && item.default && item.default.init) {
                inits.push(item.default);
            }
        });
        for (let item of inits) {
            await item.init(app);
        }
    }
}
exports.default = Startup;
//# sourceMappingURL=index.js.map