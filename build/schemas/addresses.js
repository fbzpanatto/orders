"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesPATCH = exports.addressesPOST = void 0;
exports.addressesPOST = {
    'address.company_id': {
        optional: true
    },
    'address.add_street': {
        exists: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'address.add_number': {
        exists: true,
        isLength: { options: { max: 10 } },
        escape: true
    },
    'address.add_zipcode': {
        exists: true,
        isLength: { options: { min: 8, max: 8 } },
        escape: true
    },
    'address.add_city': {
        exists: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'address.add_uf': {
        exists: true,
        isLength: { options: { min: 2, max: 2 } },
        escape: true
    },
    'address.add_neighborhood': {
        exists: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
};
exports.addressesPATCH = {
    'address.company_id': {
        optional: true,
        escape: true,
        isInt: true,
        toInt: true
    },
    'address.add_street': {
        optional: true,
        isLength: { options: { min: 3, max: 100 } },
        escape: true
    },
    'address.add_number': {
        optional: true,
        isLength: { options: { max: 10 } },
        escape: true
    },
    'address.add_zipcode': {
        optional: true,
        isLength: { options: { min: 8, max: 8 } },
        escape: true
    },
    'address.add_city': {
        optional: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    },
    'address.add_uf': {
        optional: true,
        isLength: { options: { min: 2, max: 2 } },
        escape: true
    },
    'address.add_neighborhood': {
        optional: true,
        isLength: { options: { min: 3, max: 60 } },
        escape: true
    }
};
