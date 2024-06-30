"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomFieldDate = void 0;
const validateCustomFieldDate = (value) => {
    if (!value || !value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        throw new Error('Invalid custom field value. Must be alphanumeric and contain underscores.');
    }
    return true;
};
exports.validateCustomFieldDate = validateCustomFieldDate;
