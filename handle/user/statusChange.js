"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
let config = G.CONFIGS.jwt;
async function statusChange(ctx) {
    return await new baseDao_1.default('users').update({
        id: ctx.request.query.id,
        online: ctx.request.query.online,
        ismeeting: ctx.request.query.ismeeting
    });
}
exports.statusChange = statusChange;
//# sourceMappingURL=statusChange.js.map