"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldPATCH = exports.fieldPOST = void 0;
exports.fieldPOST = {
    table_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    company_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    field_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    label: {
        exists: true,
        escape: true,
        isLength: { options: { min: 3, max: 20 } },
    }
};
exports.fieldPATCH = {
    table_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    company_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    field_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    label: {
        exists: true,
        escape: true,
        isLength: { options: { min: 3, max: 20 } },
    }
};
