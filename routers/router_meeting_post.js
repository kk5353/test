"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const create_1 = require("../handle/meeting/create");
let router = new Router();
const config = G.CONFIGS.jwt;
exports.default = (() => {
    let process = async (ctx, next) => {
        let { command } = ctx.params;
        console.log(command);
        switch (command) {
            case 'create':
                ctx.body = await create_1.create(ctx);
                break;
            default:
                ctx.body = G.jsResponse(G.STCODES.NOTFOUND, 'co1mmand is not found.');
                break;
        }
    };
    return router.post('/meeting/:command', process);
})();
//# sourceMappingURL=router_meeting_post.js.map