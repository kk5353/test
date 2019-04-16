"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serve = require("koa-static");
const path = require("path");
exports.default = () => {
    return serve(path.join(G.ROOT_PATH, 'public'));
};
//# sourceMappingURL=static.js.map