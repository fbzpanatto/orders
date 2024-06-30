"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersPATCH = exports.ordersPOST = void 0;
const customValidators_1 = require("../utils/customValidators");
exports.ordersPOST = {
    person_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    started_at: {
        exists: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    },
    ended_at: {
        optional: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    }
};
exports.ordersPATCH = {
    person_id: {
        optional: true,
        isNumeric: true,
        escape: true
    },
    started_at: {
        optional: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    },
    ended_at: {
        exists: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    }
};
