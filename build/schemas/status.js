"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusPATCH = exports.statusPOST = void 0;
exports.statusPOST = {
    status_id: {
        optional: true
    },
    company_id: {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    next_status_id: {
        optional: true
    },
    name: {
        exists: true,
        isLength: { options: { min: 3, max: 20 } },
        escape: true
    },
};
exports.statusPATCH = {
    status_id: {
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
    next_status_id: {
        optional: true
    },
    name: {
        exists: true,
        isLength: { options: { min: 3, max: 20 } },
        escape: true
    },
};
