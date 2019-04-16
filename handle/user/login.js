"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
const jwt = require("jsonwebtoken");
let config = G.CONFIGS.jwt;
async function login(ctx) {
    let rs = await new baseDao_1.default('users').retrieve({ username: ctx.request.query.username });
    if (rs.err_code === G.STCODES.SUCCESS) {
        let user = rs.data[0];
        if (ctx.request.query.password === rs.data[0]['password']) {
            let token = jwt.sign({
                userid: user.id,
                username: user.username,
            }, config.secret, {
                expiresIn: config.expires_max,
            });
            return G.jsResponse(0, 'true', { token });
        }
        else {
            return G.jsResponse(-8, 'true');
        }
    }
    else {
        return G.jsResponse(G.STCODES.QUERYEMPTY, 'The user is missing.');
    }
}
exports.login = login;
//# sourceMappingURL=login.js.map