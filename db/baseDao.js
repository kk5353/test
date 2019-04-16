"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let dialect = G.CONFIGS.db_dialect;
let Dao = require(`./${dialect}Dao`).default;
const moment = require("moment");
class BaseDao {
    constructor(table) {
        this.table = table || '';
        if (!BaseDao.dao)
            BaseDao.dao = new Dao();
    }
    async retrieve(params = {}, fields = [], session = { userid: '' }) {
        let rs;
        try {
            rs = await BaseDao.dao.select(this.table, params, fields);
        }
        catch (err) {
            err.message = `data query fail: ${err.message}`;
            return err;
        }
        if (rs.err_code === G.STCODES.SUCCESS && (!rs.data || rs.data.length === 0))
            return G.jsResponse(G.STCODES.QUERYEMPTY, 'data query empty.', rs);
        else
            return processDatum(rs);
    }
    async create(params = {}, fields = [], session = { userid: '' }) {
        let keys = Object.keys(params);
        if (keys.length === 0 || params['id'] !== undefined && keys.length <= 1)
            return G.jsResponse(G.STCODES.PRAMAERR, 'params is error.');
        else {
            let rs, id = params['id'];
            try {
                if (!id && params['uuid']) {
                    id = G.tools.uuid();
                    delete params['uuid'];
                }
                else if (params['uuid']) {
                    delete params['uuid'];
                }
                rs = await BaseDao.dao.insert(this.table, Object.assign(params, id ? { id } : {}));
            }
            catch (err) {
                err.message = `data insert fail: ${err.message}`;
                return err;
            }
            let { affectedRows } = rs;
            return G.jsResponse(G.STCODES.SUCCESS, 'data insert success.', { affectedRows, id: id || rs.insertId });
        }
    }
    async update(params, fields = [], session = { userid: '' }) {
        params = params || {};
        let keys = Object.keys(params);
        if (params['id'] === undefined || keys.length <= 1)
            return G.jsResponse(G.STCODES.PRAMAERR, 'params is error.');
        else {
            const { id, ...restParams } = params;
            let rs;
            try {
                rs = await BaseDao.dao.update(this.table, restParams, id);
            }
            catch (err) {
                err.message = `data update fail: ${err.message}`;
                return err;
            }
            let { affectedRows } = rs;
            return G.jsResponse(G.STCODES.SUCCESS, 'data update success.', { affectedRows, id });
        }
    }
    async delete(params = {}, fields = [], session = { userid: '' }) {
        if (params['id'] === undefined)
            return G.jsResponse(G.STCODES.PRAMAERR, 'params is error.');
        else {
            let id = params['id'];
            let rs;
            try {
                rs = await BaseDao.dao.delete(this.table, id);
            }
            catch (err) {
                err.message = `data delete fail: ${err.message}`;
                return err;
            }
            let { affectedRows } = rs;
            return G.jsResponse(G.STCODES.SUCCESS, 'data delete success.', { affectedRows, id });
        }
    }
    async querySql(sql, values = [], params = {}, fields = []) {
        let rs;
        try {
            rs = await BaseDao.dao.querySql(sql, values, params, fields);
        }
        catch (err) {
            err.message = `data querySql fail: ${err.message}`;
            return err;
        }
        if (rs.err_code === G.STCODES.SUCCESS && (!rs.data || rs.data.length === 0))
            return G.jsResponse(G.STCODES.QUERYEMPTY, 'data query empty.', rs);
        else
            return processDatum(rs);
    }
    async execSql(sql, values = []) {
        let rs;
        try {
            rs = await BaseDao.dao.execSql(sql, values);
        }
        catch (err) {
            err.message = `data execSql fail: ${err.message}`;
            return err;
        }
        let { affectedRows } = rs;
        return G.jsResponse(G.STCODES.SUCCESS, 'data execSql success.', { affectedRows });
    }
    async insertBatch(tablename, elements = []) {
        let rs;
        try {
            rs = await BaseDao.dao.insertBatch(tablename, elements);
        }
        catch (err) {
            err.message = `data batch fail: ${err.message}`;
            return err;
        }
        let { affectedRows } = rs;
        return G.jsResponse(G.STCODES.SUCCESS, 'data batch success.', { affectedRows });
    }
    async transGo(elements, isAsync = true) {
        let rs;
        try {
            rs = await BaseDao.dao.transGo(elements, isAsync);
        }
        catch (err) {
            err.message = `data trans fail: ${err.message}`;
            return err;
        }
        let { affectedRows } = rs;
        return G.jsResponse(G.STCODES.SUCCESS, 'data trans success.', { affectedRows });
    }
}
exports.default = BaseDao;
function processDatum(rs) {
    rs.data.forEach(element => {
        let vs = Object.entries(element);
        for (let [key, value] of vs) {
            if (G.L.endsWith(key, '_time') && value) {
                element[key] = moment(value).format('YYYY-MM-DD hh:mm:ss');
            }
            else if (G.L.endsWith(key, '_json')) {
                if (value && value.toString().trim().length === 0) {
                    element[key] = null;
                }
            }
        }
    });
    return rs;
}
//# sourceMappingURL=baseDao.js.map