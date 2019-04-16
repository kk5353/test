"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const baseDao_1 = require("../db/baseDao");
let router = new Router();
const config = G.CONFIGS.jwt;
exports.default = (() => {
    let process = async (ctx, next) => {
        let { command } = ctx.params;
        switch (command) {
            case 'login':
                let rs = await new baseDao_1.default('users').retrieve({ username: ctx.request.body.username });
                if (rs.status === G.STCODES.SUCCESS) {
                    let user = rs.data[0];
                    let token = jwt.sign({
                        userid: user.id,
                        username: user.username,
                    }, config.secret, {
                        expiresIn: config.expires_max,
                    });
                    ctx.body = G.jsResponse(G.STCODES.SUCCESS, 'login success.', { token });
                }
                else {
                    ctx.body = G.jsResponse(G.STCODES.QUERYEMPTY, 'The user is missing.');
                }
                break;
            default:
                ctx.body = G.jsResponse(G.STCODES.NOTFOUND, 'command is not found.');
                break;
        }
    };
    return router.post('/op/:command', process);
})();
//# sourceMappingURL=router_op.js.map