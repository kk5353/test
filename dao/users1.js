"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../db/baseDao");
class Users1 extends baseDao_1.default {
    constructor(table) {
        super(table);
    }
    async retrieve(params = {}, fields = [], session = { userid: '' }) {
        return G.jsResponse(G.STCODES.SUCCESS, 'query ok.', { test: 'ssssss' });
    }
    async create(params = {}, fields = [], session = { userid: '' }) {
        return G.jsResponse(G.STCODES.SUCCESS, 'create ok.', [{ test: 'ssssss' }, session]);
    }
    async update(params = {}, fields = [], session = { userid: '' }) {
        return G.jsResponse(G.STCODES.SUCCESS, 'update ok.', [{ test: 'ssssss' }, session]);
    }
    async delete(params = {}, fields = [], session = { userid: '' }) {
        return G.jsResponse(G.STCODES.SUCCESS, 'delete ok.', [{ test: 'ssssss' }, session]);
    }
}
exports.default = Users1;
//# sourceMappingURL=users1.js.map