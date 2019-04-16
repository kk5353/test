"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
let config = G.CONFIGS.jwt;
async function suggest(ctx) {
    let rs = await new baseDao_1.default('suggest').create({ username: ctx.request.body.username, time: 1350052653 });
    if (rs.err_code === G.STCODES.SUCCESS) {
        let user = rs.data[0];
        return G.jsResponse(-8, 'true');
    }
    else {
        return G.jsResponse(G.STCODES.QUERYEMPTY, 'The user is missing.');
    }
}
exports.suggest = suggest;
//# sourceMappingURL=suggest.js.map