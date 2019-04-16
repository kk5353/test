"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const login_1 = require("../handle/user/login");
const register_1 = require("../handle/user/register");
let router = new Router();
const config = G.CONFIGS.jwt;
exports.default = (() => {
    let process = async (ctx, next) => {
        let { command } = ctx.params;
        console.log(command);
        switch (command) {
            case 'login':
                ctx.body = await login_1.login(ctx);
                break;
            case 'register':
                ctx.body = await register_1.register(ctx);
                break;
            default:
                ctx.body = G.jsResponse(G.STCODES.NOTFOUND, 'co1mmand is not found.');
                break;
        }
    };
    return router.get('/user/:command', process);
})();
//# sourceMappingURL=router_user_get.js.map