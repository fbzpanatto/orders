"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalPATCH = exports.normalPOST = void 0;
const addresses_1 = require("./addresses");
const complementary_1 = require("./complementary");
const normalCustomerPOST = {
    'customer.person_id': {
        optional: true
    },
    'customer.cpf': {
        exists: true,
        optional: false,
        isLength: { options: { min: 11, max: 11 } },
        escape: true
    },
    'customer.first_name': {
        exists: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'customer.middle_name': {
        optional: true,
        isLength: { options: { max: 60 } },
        escape: true
    },
    'customer.last_name': {
        exists: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'customer.created_at': {
        optional: true,
        escape: true
    },
};
const normalCustomerPATCH = {
    'customer.person_id': {
        optional: true
    },
    'customer.cpf': {
        optional: true,
        isLength: { options: { min: 11, max: 11 } },
        escape: true
    },
    'customer.first_name': {
        optional: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'customer.middle_name': {
        optional: true,
        isLength: { options: { max: 60 } },
        escape: true
    },
    'customer.last_name': {
        optional: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'customer.created_at': {
        optional: true,
        escape: true
    },
};
exports.normalPOST = {
    company: { optional: true },
    customer: { exists: true },
    address: { exists: true },
    person: { optional: true },
    contacts: { optional: true },
    segments: { optional: true },
    ...normalCustomerPOST,
    ...addresses_1.addressesPOST,
    ...complementary_1.person
};
exports.normalPATCH = {
    company: { optional: true },
    customer: { optional: true },
    address: { optional: true },
    person: { optional: true },
    contacts: { optional: true },
    segments: { optional: true },
    ...normalCustomerPATCH,
    ...addresses_1.addressesPATCH,
    ...complementary_1.person
};
