"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.person = void 0;
exports.person = {
    'person.observation': {
        optional: true,
        isLength: { options: { max: 45 } },
        escape: true
    },
    'person.first_field': {
        optional: true,
        isLength: { options: { max: 100 } },
        escape: true
    },
    'person.second_field': {
        optional: true,
        isLength: { options: { max: 100 } },
        escape: true
    },
    'person.third_field': {
        optional: true,
        isLength: { options: { max: 100 } },
        escape: true
    },
    'person.company_id': {
        optional: true,
        escape: true,
        isInt: true,
        toInt: true
    },
};
