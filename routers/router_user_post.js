"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const delete_1 = require("../handle/user/delete");
const layout_1 = require("../handle/user/layout");
const update_1 = require("../handle/user/update");
const statusChange_1 = require("../handle/user/statusChange");
const suggest_1 = require("../handle/user/suggest");
let router = new Router();
const config = G.CONFIGS.jwt;
exports.default = (() => {
    let process = async (ctx, next) => {
        let { command } = ctx.params;
        switch (command) {
            case 'delete':
                return ctx.body = await delete_1.deleteuser(ctx);
            case 'layout':
                return ctx.body = await layout_1.layout(ctx);
            case 'update':
                return ctx.body = await update_1.update(ctx);
            case 'statusChange':
                return ctx.body = await statusChange_1.statusChange(ctx);
            case 'suggest':
                return ctx.body = await suggest_1.suggest(ctx);
            default:
                ctx.body = G.jsResponse(G.STCODES.NOTFOUND, 'co1mmand is not found.');
                break;
        }
    };
    return router.post('/user/:command', process);
})();
//# sourceMappingURL=router_user_post.js.map