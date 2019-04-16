"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDao_1 = require("../../db/baseDao");
const uuid = require("uuid");
let config = G.CONFIGS.jwt;
async function create(ctx) {
    let rs = await new baseDao_1.default('front').retrieve({ userid: ctx.request.body.id });
    if (rs.err_code === G.STCODES.SUCCESS) {
        let user = rs.data[0];
        let rsdata = {};
        rsdata['mediaServerMain'] = user['mediaServerMain'];
        rsdata['mediaServerBak'] = user['mediaServerBak'];
        rsdata['meetingId'] = uuid();
        let rsmeeting = await new baseDao_1.default('meeting').create({ meetingid: rsdata['meetingId'], chairMan: ctx.request.body.id, userId: JSON.stringify(ctx.request.body.userId) });
        if (rsmeeting.err_code === G.STCODES.SUCCESS) {
            return G.jsResponse(0, 'true', rsdata);
        }
        else {
            return G.jsResponse(-8, '数据库故障，插入meeting表格错误', ctx.request.body.userId);
        }
    }
    else {
        return G.jsResponse(G.STCODES.QUERYEMPTY, 'The user is missing.');
    }
}
exports.create = create;
//# sourceMappingURL=create.js.map