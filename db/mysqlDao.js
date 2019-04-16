"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
const OPMETHODS = {
    Insert: 'INSERT INTO ?? SET ?',
    Update: 'UPDATE ?? SET ? WHERE ?',
    Delete: 'DELETE FROM ?? WHERE ?',
    Batch: 'INSERT INTO ?? (??) VALUES ',
};
const QUERYSTATISKEYS = ['count', 'sum'];
const QUERYEXTRAKEYS = ['lks', 'ins', 'ors'];
const QUERYUNEQOPERS = ['>,', '>=,', '<,', '<=,', '<>,', '=,'];
let options = {
    'host': G.CONFIGS.dbconfig.db_host,
    'port': G.CONFIGS.dbconfig.db_port,
    'database': G.CONFIGS.dbconfig.db_name,
    'user': G.CONFIGS.dbconfig.db_user,
    'password': G.CONFIGS.dbconfig.db_pass,
    'charset': G.CONFIGS.dbconfig.db_char,
    'connectionLimit': G.CONFIGS.dbconfig.db_conn,
    'connectTimeout': 30000,
    'supportBigNumbers': true,
    'bigNumberStrings': true
};
let pool = mysql2_1.createPool(options);
class MysqlDao {
    select(tablename, params = {}, fields) {
        fields = fields || [];
        return this.query(tablename, params, fields, '', []);
    }
    insert(tablename, params = {}) {
        return this.execQuery(OPMETHODS['Insert'], [tablename, params]);
    }
    update(tablename, params = {}, id) {
        return this.execQuery(OPMETHODS['Update'], [tablename, params, { id }]);
    }
    delete(tablename, id) {
        return this.execQuery(OPMETHODS['Delete'], [tablename, { id }]);
    }
    querySql(sql, values, params, fields) {
        fields = fields || [];
        params = params || [];
        return this.query('QuerySqlSelect', params, fields, sql, values);
    }
    execSql(sql, values) {
        return this.execQuery(sql, values);
    }
    insertBatch(tablename, elements) {
        let sql = OPMETHODS['Batch'];
        let updateStr = '';
        let values = [tablename];
        let valKeys = [];
        for (let i = 0; i < elements.length; i++) {
            if (i === 0) {
                valKeys = Object.keys(elements[i]);
                values.push(valKeys);
            }
            let valueStr = [];
            for (let j = 0; j < valKeys.length; j++) {
                valueStr.push(elements[i][valKeys[j]]);
                if (i === 0)
                    updateStr += valKeys[j] + ' = values(' + valKeys[j] + '),';
            }
            values.push(valueStr);
            sql += ' (?),';
        }
        sql = sql.substring(0, sql.length - 1);
        sql += ' ON DUPLICATE KEY UPDATE ';
        sql += updateStr.substring(0, updateStr.length - 1);
        return this.execQuery(sql, values);
    }
    transGo(elements, isAsync = true) {
        let sqls = [];
        elements.forEach((ele) => {
            let values = [ele.table];
            let params = ele.params;
            let keys = Object.keys(params);
            if (Array.isArray(params)) {
                values = values.concat(params);
            }
            else if (keys.length > 0) {
                values.push(params);
            }
            if (ele.id !== undefined)
                values.push({ id: ele.id });
            let sql = { text: '', values };
            if (ele.sql !== undefined) {
                sql.text = ele.sql;
            }
            else {
                sql.text = OPMETHODS[ele.method];
            }
            sqls.push(sql);
        });
        return this.execTrans(sqls, isAsync);
    }
    execTrans(sqls, isAsync) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(G.jsResponse(G.STCODES.DATABASECOERR, err.message));
                    G.logger.error(err.message);
                }
                else {
                    MysqlDao.logFlag && G.logger.debug(`Beginning ${isAsync ? 'Async' : 'Sync'} trans, ${sqls.length} operations are going to do.`);
                    conn.beginTransaction((err) => {
                        if (err) {
                            reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                        }
                        else {
                            if (isAsync) {
                                let funcArr = [];
                                sqls.forEach((sqlParam) => { funcArr.push(doOne(sqlParam)); });
                                Promise.all(funcArr).then((resp) => {
                                    conn.commit((err) => {
                                        if (err) {
                                            conn.rollback(() => {
                                                conn.release();
                                            });
                                            G.logger.error(`Async trans run fail, ${err.message}`);
                                            reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                                        }
                                        else {
                                            conn.release();
                                            MysqlDao.logFlag && G.logger.debug(`Ending Async trans, ${funcArr.length} operations have been done.`);
                                            resolve(G.jsResponse(G.STCODES.SUCCESS, 'trans run succes.', { resp, affectedRows: resp.length }));
                                        }
                                    });
                                }).catch((err) => {
                                    conn.rollback(() => {
                                        conn.release();
                                    });
                                    reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                                });
                            }
                            else {
                                let sqlArr = G.L.cloneDeep(sqls);
                                goTrans(sqlArr);
                            }
                            function doOne(sqlParam) {
                                return new Promise((resolve, reject) => {
                                    let sql = sqlParam.text;
                                    let values = sqlParam.values;
                                    conn.query(sql, values, (err, result) => {
                                        if (err) {
                                            conn.rollback(() => {
                                                G.logger.error(`${isAsync ? 'Async' : 'Sync'} trans run fail, _Sql_ : ${sqlParam.text}, _Values_ : ${JSON.stringify(sqlParam.values)}, _Err_ : ${err.message}`);
                                                return reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                                            });
                                        }
                                        else {
                                            MysqlDao.logFlag && G.logger.debug(`${isAsync ? 'Async' : 'Sync'} trans run success, _Sql_ : ${sqlParam.text}, _Values_ : ${JSON.stringify(sqlParam.values)}`);
                                            return resolve(G.jsResponse(G.STCODES.SUCCESS, 'trans run success', result));
                                        }
                                    });
                                });
                            }
                            function goTrans(sqlArr, result) {
                                if (sqlArr.length > 0) {
                                    doOne(sqlArr.shift()).then((result) => {
                                        goTrans(sqlArr);
                                    }).catch((err) => {
                                        reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                                    });
                                }
                                else {
                                    conn.commit((err) => {
                                        if (err) {
                                            conn.rollback(() => {
                                                conn.release();
                                            });
                                            MysqlDao.logFlag && G.logger.debug(`Sync trans run fail, ${err.message}`);
                                            reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                                        }
                                        else {
                                            conn.release();
                                            MysqlDao.logFlag && G.logger.debug(`Ending Sync trans, ${sqls.length} operations have been done.`);
                                            resolve(G.jsResponse(G.STCODES.SUCCESS, 'Sync trans run succes.', { affectedRows: sqls.length }));
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });
    }
    async query(tablename, params, fields = [], sql = '', values = []) {
        params = params || {};
        let where = '';
        const AndJoinStr = ' and ';
        let { sort, search, page, size, sum, count, group, ...restParams } = params;
        let { lks, ins, ors } = restParams;
        let queryKeys = { ors, count, lks, ins, sum };
        page = page || 0;
        size = size || G.PAGESIZE;
        let keys = Object.keys(restParams);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = params[key];
            if (QUERYEXTRAKEYS.indexOf(key) < 0) {
                let is_val_arr = G.tools.arryParse(value);
                if (is_val_arr)
                    value = is_val_arr;
            }
            if (where !== '') {
                where += AndJoinStr;
            }
            if (QUERYEXTRAKEYS.indexOf(key) >= 0) {
                let whereExtra = '', err = null;
                let ele = queryKeys[key] = G.tools.arryParse(queryKeys[key]);
                if (!ele || ele.length < 2 || ((key === 'ors' || key === 'lks') && ele.length % 2 === 1))
                    err = `Format of ${key} is wrong.`;
                else {
                    if (key === 'ins') {
                        let c = ele.shift();
                        whereExtra += c + ' in ( ? ) ';
                        values.push(ele);
                    }
                    else if (key === 'lks' || key === 'ors') {
                        whereExtra = ' ( ';
                        for (let j = 0; j < ele.length; j += 2) {
                            if (j > 0)
                                whereExtra += ' or ';
                            if (ele[j + 1] == null) {
                                whereExtra += ele[j] + ' is null ';
                            }
                            else {
                                whereExtra += `${ele[j]} ${key === 'lks' ? 'like' : '='} ? `;
                                let whereStr = ele[j + 1];
                                if (key === 'lks')
                                    whereStr = `%${ele[j + 1]}%`;
                                values.push(whereStr);
                            }
                        }
                        whereExtra += ' ) ';
                    }
                }
                if (err)
                    return Promise.reject(G.jsResponse(G.STCODES.PRAMAERR, err));
                else
                    where += whereExtra;
            }
            else {
                if (value === 'null') {
                    where += keys[i] + ' is null ';
                }
                else if ((Array.isArray(value) && (value.length === 2 || value.length === 4)) &&
                    QUERYUNEQOPERS.some((element) => {
                        if (Array.isArray(value)) {
                            return value.join().startsWith(element);
                        }
                        else if (typeof value === 'string') {
                            return value.startsWith(element);
                        }
                        else
                            return false;
                    })) {
                    if (Array.isArray(value)) {
                        value = value.join();
                    }
                    let vls = value.split(',');
                    if (vls.length === 2) {
                        where += keys[i] + vls[0] + ' ? ';
                        values.push(vls[1]);
                    }
                    else if (vls.length === 4) {
                        where += keys[i] + vls[0] + ' ? and ' + keys[i] + vls[2] + ' ? ';
                        values.push(vls[1]);
                        values.push(vls[3]);
                    }
                    else {
                        if (where.endsWith(AndJoinStr))
                            where = where.substr(0, where.length - AndJoinStr.length);
                    }
                }
                else if (search !== undefined) {
                    value = pool.escape(value).replace(/\', \'/g, "%' and " + key + " like '%");
                    value = value.substring(1, value.length - 1);
                    where += key + " like '%" + value + "%'";
                }
                else {
                    where += keys[i] + ' = ? ';
                    values.push(value);
                }
            }
        }
        let extra = '';
        for (let i = 0; i < QUERYSTATISKEYS.length; i++) {
            let element = QUERYSTATISKEYS[i];
            if (queryKeys[element]) {
                let ele = queryKeys[element] = G.tools.arryParse(queryKeys[element]);
                if (!ele || ele.length === 0 || ele.length % 2 === 1)
                    return Promise.resolve(G.jsResponse(G.STCODES.PRAMAERR, `Format of ${element} is wrong.`));
                for (let i = 0; i < ele.length; i += 2) {
                    extra += `,${element}(${ele[i]}) as ${ele[i + 1]} `;
                }
            }
        }
        if (tablename === 'QuerySqlSelect')
            sql = sql + (where === '' ? '' : (' and ' + where));
        else {
            sql = `SELECT ${fields.length > 0 ? fields.join() : '*'}${extra} FROM ${tablename} `;
            if (where !== '') {
                sql += ' WHERE ' + where;
            }
        }
        if (group !== undefined) {
            let value = pool.escape(group);
            group = ' GROUP BY ' + value.substring(1, value.length - 1);
            sql += group;
        }
        if (sort !== undefined) {
            let value = pool.escape(sort);
            sort = ' ORDER BY ' + value.substring(1, value.length - 1);
            sql += sort;
        }
        if (page > 0) {
            page--;
            let sqlQuery = sql + ' LIMIT ' + page * size + ',' + size;
            let index = sql.toLocaleLowerCase().lastIndexOf(' from ');
            let end = sql.toLocaleLowerCase().lastIndexOf(' order by');
            let sqlCount = 'SELECT count(1) as count ' + sql.substring(index, end > 0 ? end : sql.length);
            const resp = await Promise.all([this.execQuery(sqlQuery, values), this.execQuery(sqlCount, values)]);
            let ct = 0;
            if (group) {
                ct = resp[1].length;
            }
            else if (resp[1].length > 0) {
                ct = resp[1][0].count;
            }
            return G.jsResponse(G.STCODES.SUCCESS, 'data query success.', {
                data: resp[0],
                pages: Math.ceil(ct / size),
                records: ct,
            });
        }
        else {
            const rs = await this.execQuery(sql, values);
            return G.jsResponse(G.STCODES.SUCCESS, 'data query success.', {
                data: rs,
                pages: rs.length > 0 ? 1 : 0,
                records: rs.length,
            });
        }
    }
    execQuery(sql, values) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(G.jsResponse(G.STCODES.DATABASECOERR, err.message));
                    G.logger.error(err.message);
                }
                else {
                    connection.query(sql, values, function (err, result) {
                        connection.release();
                        let v = values ? ' _Values_ :' + JSON.stringify(values) : '';
                        if (err) {
                            reject(G.jsResponse(G.STCODES.DATABASEOPERR, err.message));
                            G.logger.error(err.message + ' _Sql_ : ' + sql + v);
                        }
                        else {
                            resolve(result);
                            MysqlDao.logFlag && G.logger.debug(' _Sql_ : ' + sql + v);
                        }
                    });
                }
            });
        });
    }
}
MysqlDao.logFlag = G.CONFIGS.DbLogClose ? false : true;
exports.default = MysqlDao;
//# sourceMappingURL=mysqlDao.js.map