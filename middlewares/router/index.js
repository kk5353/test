"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("../../routers");
exports.default = async () => {
    routers_1.default.push(async (ctx, next) => {
        ctx.body = G.jsResponse(G.STCODES.NOTFOUND, 'What you request is not found.');
    });
    return routers_1.default;
};
//# sourceMappingURL=index.js.map