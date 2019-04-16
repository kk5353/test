"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const Bluebird = require("bluebird");
const globUtils_1 = require("../common/globUtils");
const configs_1 = require("../config/configs");
const enums_1 = require("./enums");
const log4js_1 = require("log4js");
const log4js_2 = require("../config/log4js");
const env = process.env.NODE_ENV || 'dev';
let GlobVar = {
    PAGESIZE: 10,
    STCODES: enums_1.default,
    ROOT_PATH: `${process.cwd()}${env === 'dev' ? '' : '/dist'}`,
    NODE_ENV: env,
    L: lodash,
    logger: (() => {
        log4js_1.configure(log4js_2.default);
        return log4js_1.getLogger('default');
    })(),
    jsResponse(err_code, message = '', data) {
        if (Array.isArray(data))
            return { err_code, message, data };
        else
            return Object.assign({}, data, { err_code, message });
    },
    tools: new globUtils_1.default(),
    CONFIGS: configs_1.default,
    koaError(ctx, status, message, data = []) {
        ctx.ErrCode = status;
        return new KoaErr({ message, status });
    }
};
exports.GlobVar = GlobVar;
async function globInit() {
    Object.assign(global, { G: GlobVar }, { Promise: Bluebird });
}
exports.globInit = globInit;
class KoaErr extends Error {
    constructor({ message = 'Error', status = G.STCODES.EXCEPTION } = {}, ...args) {
        super();
        this.message = message;
        this.status = status;
        if (args.length > 0) {
            Object.assign(this, args[0]);
        }
    }
}
//# sourceMappingURL=global.js.map