"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class GlobUtils {
    uuid() {
        return uuid.v1().split('-')[0];
    }
    isDev() {
        return G.NODE_ENV !== 'prod';
    }
    isLogin() {
        return true;
    }
    arryParse(arr) {
        try {
            if (Array.isArray(arr) || G.L.isNull(arr))
                return arr;
            else if (typeof arr === 'string') {
                if (arr.startsWith('['))
                    arr = JSON.parse(arr);
                else
                    arr = arr.split(',');
            }
            else
                return null;
        }
        catch (err) {
            arr = null;
        }
        return arr;
    }
}
exports.default = GlobUtils;
//# sourceMappingURL=globUtils.js.map