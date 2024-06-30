"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personSegmentsPATCH = exports.personSegmentsPOST = void 0;
const customValidators_1 = require("../utils/customValidators");
exports.personSegmentsPOST = {
    person_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    segment_id: {
        exists: true,
        isNumeric: true,
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
exports.personSegmentsPATCH = {
    person_id: {
        exists: true,
        isNumeric: true,
        escape: true
    },
    segment_id: {
        exists: true,
        isNumeric: true,
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
