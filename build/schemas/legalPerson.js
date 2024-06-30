"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalPATCH = exports.legalPOST = void 0;
const complementary_1 = require("./complementary");
const addresses_1 = require("./addresses");
const legalCustomerPOST = {
    'customer.person_id': {
        optional: true
    },
    'customer.company_id': {
        exists: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    'customer.cnpj': {
        exists: true,
        isLength: { options: { min: 14, max: 14 } },
        escape: true
    },
    'customer.corporate_name': {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'customer.social_name': {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'customer.state_registration': {
        exists: true,
        isLength: { options: { min: 9, max: 9 } },
        escape: true
    },
};
const legalCustomerPATCH = {
    'customer.person_id': {
        optional: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    'customer.company_id': {
        optional: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    'customer.cnpj': {
        optional: true,
        isLength: { options: { min: 14, max: 14 } },
        escape: true
    },
    'customer.corporate_name': {
        optional: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'customer.social_name': {
        optional: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'customer.state_registration': {
        optional: true,
        isLength: { options: { min: 9, max: 9 } },
        escape: true
    },
};
exports.legalPOST = {
    company: { optional: true },
    customer: { exists: true },
    address: { exists: true },
    person: { exists: true },
    contacts: { optional: true },
    segments: { optional: true },
    ...legalCustomerPOST,
    ...addresses_1.addressesPOST,
    ...complementary_1.person
};
exports.legalPATCH = {
    company: { optional: true },
    customer: { optional: true },
    address: { optional: true },
    person: { optional: true },
    contacts: { optional: true },
    segments: { optional: true },
    ...legalCustomerPATCH,
    ...addresses_1.addressesPATCH,
    ...complementary_1.person
};
