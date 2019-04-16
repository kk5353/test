"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
let config = G.CONFIGS.jwt;
async function layout(ctx) {
    let result = await new baseDao_1.default('front').update({ id: ctx.request.body.id, layout: ctx.request.body.layout });
    return await new baseDao_1.default('users').update({ id: ctx.request.body.id, username: ctx.request.body.username });
}
exports.layout = layout;
//# sourceMappingURL=layout.js.map