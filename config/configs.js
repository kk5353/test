"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    inits: {
        directory: {
            run: false,
            dirs: ['public/upload', 'public/temp']
        },
        socket: {
            run: false
        }
    },
    port: 5000,
    StandSocketPort: 1202,
    db_dialect: 'mysql',
    DbLogClose: false,
    dbconfig: {
        db_host: '39.98.212.236',
        db_port: 20002,
        db_name: 'default',
        db_user: 'admin',
        db_pass: 'b6be6397',
        db_char: 'utf8mb4',
        db_conn: 5,
    },
    jwt: {
        secret: 'zh-123456SFU>a4bh_$3#46d0e85W10aGMkE5xKQ',
        expires_max: 36000
    },
};
//# sourceMappingURL=configs.js.map