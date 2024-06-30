"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsPATCH = exports.productsPOST = void 0;
const customValidators_1 = require("../utils/customValidators");
exports.productsPOST = {
    name: {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    created_at: {
        exists: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    },
    updated_at: {
        optional: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    }
};
exports.productsPATCH = {
    name: {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    created_at: {
        optional: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    },
    updated_at: {
        exists: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    }
};
