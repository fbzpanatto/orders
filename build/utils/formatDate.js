"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
function formatDate(date) {
    const localDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
    return (0, date_fns_1.format)(localDate, 'yyyy-MM-dd HH:mm:ss');
}
exports.formatDate = formatDate;
