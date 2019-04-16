"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
const jwt = require("jsonwebtoken");
let config = G.CONFIGS.jwt;
async function register(ctx) {
    let rs = await new baseDao_1.default('users').retrieve({ username: ctx.request.query.username });
    if (rs.err_code === G.STCODES.QUERYEMPTY) {
        let mess = await new baseDao_1.default('users').create({
            'username': ctx.request.query.username,
            'password': ctx.request.query.password
        });
        let token = jwt.sign({
            userid: mess.id,
            username: ctx.request.query.username,
        }, config.secret, {
            expiresIn: config.expires_max,
        });
        mess.token = token;
        mess.message = '注册成功';
        delete mess.affectedRows;
        return mess;
    }
    else {
        return G.jsResponse(-5, '用户名被占用');
    }
}
exports.register = register;
//# sourceMappingURL=register.js.map