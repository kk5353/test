"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
let config = G.CONFIGS.jwt;
async function update(ctx) {
    return await new baseDao_1.default('users').update({ id: ctx.request.query.id, username: ctx.request.query.username });
}
exports.update = update;
//# sourceMappingURL=update.js.map