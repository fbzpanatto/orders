"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersProductStatusPATCH = exports.ordersProductStatusPOST = void 0;
const customValidators_1 = require("../utils/customValidators");
exports.ordersProductStatusPOST = {
    order_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    product_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    status_id: {
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
exports.ordersProductStatusPATCH = {
    status_id: {
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
        optional: true,
        escape: true,
        custom: {
            options: customValidators_1.validateCustomFieldDate
        }
    }
};
