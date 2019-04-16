"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const inits_1 = require("./inits");
exports.default = {
    async init() {
        const app = new Koa();
        app.proxy = true;
        const middlewares = [
            'cors',
            'logger',
            'session',
            'globalError',
            'conditional',
            'etag',
            'bodyParser',
            'rewrite',
            'static',
            'router',
        ];
        for (let n of middlewares) {
            if (n) {
                const middleware = await this.loadMiddleware.apply(null, [].concat(n));
                if (middleware) {
                    for (let m of [].concat(middleware)) {
                        m && (app.use.apply(app, [].concat(m)));
                    }
                }
            }
        }
        await new inits_1.default().init(app);
        return app;
    },
    async loadMiddleware(name, ...args) {
        const middleware = require('./middlewares/' + name).default;
        return (middleware && await middleware.apply(null, args)) || async function (ctx, next) { await next(); };
    }
};
//# sourceMappingURL=app.js.map