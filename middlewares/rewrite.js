"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rewrite = require("koa-rewrite");
exports.default = () => {
    return [
        rewrite('/index.html', '/')
    ];
};
//# sourceMappingURL=rewrite.js.map