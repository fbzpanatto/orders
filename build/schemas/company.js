"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyPATCH = exports.companyPOST = void 0;
const addresses_1 = require("./addresses");
exports.companyPOST = {
    company: { exists: true },
    address: { exists: true },
    'company.company_id': {
        optional: true
    },
    'company.cnpj': {
        exists: true,
        isLength: { options: { min: 14, max: 14 } },
        escape: true
    },
    'company.state_registration': {
        exists: true,
        isLength: { options: { min: 9, max: 9 } },
        escape: true
    },
    'company.corporate_name': {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'company.social_name': {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'company.active': {
        optional: true
    },
    ...addresses_1.addressesPOST,
};
exports.companyPATCH = {
    company: { optional: true },
    address: { optional: true },
    'company.company_id': {
        optional: true,
    },
    'company.cnpj': {
        optional: true,
        isLength: { options: { min: 14, max: 14 } },
        escape: true
    },
    'company.state_registration': {
        optional: true,
        isLength: { options: { min: 9, max: 9 } },
        escape: true
    },
    'company.corporate_name': {
        optional: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'company.social_name': {
        optional: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'company.active': {
        optional: true,
        isBoolean: true
    },
    ...addresses_1.addressesPATCH,
};
