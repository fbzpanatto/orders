"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phonesPATCH = exports.phonesPOST = void 0;
const customValidators_1 = require("../utils/customValidators");
exports.phonesPOST = {
    person_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    phone_number: {
        exists: true,
        isLength: { options: { min: 3, max: 15 } },
        escape: true
    },
    contact: {
        exists: true,
        isLength: { options: { min: 3, max: 45 } },
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
exports.phonesPATCH = {
    phone_number: {
        optional: true,
        isLength: { options: { min: 3, max: 15 } },
        escape: true
    },
    contact: {
        optional: true,
        isLength: { options: { min: 3, max: 45 } },
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
