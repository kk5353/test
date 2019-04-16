"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
let config = G.CONFIGS.jwt;
async function deleteuser(ctx) {
    return await new baseDao_1.default('users').delete({ id: ctx.request.body.id });
}
exports.deleteuser = deleteuser;
//# sourceMappingURL=delete.js.map