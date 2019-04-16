"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../db/baseDao");
class Users extends baseDao_1.default {
    constructor(table) {
        super(table);
    }
    async retrieve(params = {}, fields = [], session = { userid: '' }) {
        return await new baseDao_1.default('users').retrieve({ id: 1 });
    }
}
exports.default = Users;
//# sourceMappingURL=z.template.1.js.map