"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const config = G.CONFIGS.jwt;
const AUTHURL = ['rs'];
exports.default = () => {
    return async (ctx, next) => {
        const { header: { token } } = ctx;
        let urlStrs = ctx && ctx.url && ctx.url.split('/');
        let isAuth = AUTHURL.some((url) => { return urlStrs[1] === url; });
        if (token) {
            try {
                const decoded = jwt.verify(token, config.secret);
                ctx.session = decoded;
                await next();
            }
            catch (err) {
                if (ctx.method === 'GET' || !isAuth) {
                    return await next();
                }
                if (err.name === 'TokenExpiredError') {
                    ctx.body = G.jsResponse(G.STCODES.JWTAUTHERR, 'Token Expired.');
                }
                else if (err.name === 'JsonWebTokenError') {
                    ctx.body = G.jsResponse(G.STCODES.JWTAUTHERR, 'Invalid Token.');
                }
                else {
                    ctx.body = G.jsResponse(G.STCODES.JWTAUTHERR, err.message);
                }
            }
        }
        else {
            if (ctx.method !== 'GET' && isAuth) {
                let aa = ctx.session;
                ctx.body = G.jsResponse(G.STCODES.JWTAUTHERR, 'Missing Auth Token.');
            }
            else {
                await next();
            }
        }
    };
};
//# sourceMappingURL=session.js.map