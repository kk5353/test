"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const baseDao_1 = require("../db/baseDao");
let router = new Router();
const METHODS = {
    GET: 'retrieve',
    POST: 'create',
    PUT: 'update',
    DELETE: 'delete'
};
exports.default = (() => {
    let process = async (ctx, next) => {
        let method = ctx.method.toUpperCase();
        let tableName = ctx.params.table;
        let id = ctx.params.id;
        let params = method === 'POST' || method === 'PUT' ? ctx.request.body : ctx.request.query;
        if (id != null)
            params.id = id;
        let { fields, ...restParams } = params;
        if (fields) {
            fields = G.tools.arryParse(fields);
            if (!fields) {
                throw G.koaError(ctx, G.STCODES.PRAMAERR, 'params fields is wrong.');
            }
        }
        let module = loadModule(`../dao/${tableName}`), is_module_exist = true;
        if (!module) {
            is_module_exist = false;
            module = require('../db/baseDao');
        }
        if (method === 'GET' && !tableName.startsWith('v_') && (!is_module_exist ||
            is_module_exist && !Object.getOwnPropertyNames(module.default.prototype).some((al) => al === 'retrieve'))) {
            let rs = await new baseDao_1.default().querySql('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA= ? and TABLE_NAME= ? ', [G.CONFIGS.dbconfig.db_name, 'v_' + tableName]);
            if (rs.status === 200)
                tableName = 'v_' + tableName;
        }
        let rs;
        try {
            let db = new module.default(tableName);
            rs = await db[METHODS[method]](restParams, fields, ctx.session);
        }
        catch (err) {
            rs = G.jsResponse(G.STCODES.EXCEPTION, err.message, { stack: err.stack });
        }
        ctx.body = rs;
    };
    return router.all('/rs/:table', process).all('/rs/:table/:id', process);
})();
function loadModule(path) {
    try {
        return require(path);
    }
    catch (err) {
        if (err.message.indexOf('Cannot find module') < 0)
            G.logger.error(err.message);
        return null;
    }
}
//# sourceMappingURL=router_rs.js.map