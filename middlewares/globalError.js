"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            ctx.body = G.jsResponse(ctx.ErrCode || G.STCODES.EXCEPTION, err.message, { stack: err.stack });
        }
    };
};
//# sourceMappingURL=globalError.js.map