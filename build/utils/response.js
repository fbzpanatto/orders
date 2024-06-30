"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectResponse = void 0;
const objectResponse = (status, message, object = {}) => {
    return {
        status,
        message,
        ...object,
    };
};
exports.objectResponse = objectResponse;
