"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyValidationOrderProductStatus = exports.validatePatchOrderProductStatus = exports.validatePostOrderProductStatus = exports.bodyValidationOrders = exports.validatePatchOrders = exports.validatePostOrders = exports.bodyValidationProducts = exports.validatePatchProducts = exports.validatePostProducts = exports.bodyValidationStatus = exports.validatePatchStatus = exports.validatePostStatus = exports.bodyValidationSegment = exports.validatePatchSegments = exports.validatePostSegments = exports.bodyValidationPersonSegments = exports.validatePatchPersonSegments = exports.validatePostPersonSegments = exports.bodyValidationNormal = exports.validatePatchNormal = exports.validatePostNormal = exports.bodyValidationLegal = exports.validatePatchLegal = exports.validatePostLegal = exports.bodyValidationPermissions = exports.validatePatchPermissions = exports.validatePostPermission = exports.bodyValidationCompany = exports.validatePatchCompany = exports.validatePostCompany = exports.bodyValidationUser = exports.validatePatchUser = exports.validatePostUser = exports.bodyValidationField = exports.validatePatchField = exports.validatePostField = exports.validatePersonId = exports.validateId = void 0;
const express_validator_1 = require("express-validator");
const bodyValidations_1 = require("../utils/bodyValidations");
const legalPerson_1 = require("../schemas/legalPerson");
const normalPerson_1 = require("../schemas/normalPerson");
const segments_1 = require("../schemas/segments");
const personSegments_1 = require("../schemas/personSegments");
const status_1 = require("../schemas/status");
const products_1 = require("../schemas/products");
const orders_1 = require("../schemas/orders");
const orderProductStatus_1 = require("../schemas/orderProductStatus");
const company_1 = require("../schemas/company");
const permissions_1 = require("../schemas/permissions");
const users_1 = require("../schemas/users");
const fields_1 = require("../schemas/fields");
exports.validateId = (0, express_validator_1.check)('id').not().isEmpty().isNumeric();
exports.validatePersonId = (0, express_validator_1.check)('personId').not().isEmpty().isNumeric();
// Field
exports.validatePostField = (0, express_validator_1.checkSchema)(fields_1.fieldPOST);
exports.validatePatchField = (0, express_validator_1.checkSchema)(fields_1.fieldPATCH);
const bodyValidationField = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, fields_1.fieldPOST);
};
exports.bodyValidationField = bodyValidationField;
// Company
exports.validatePostUser = (0, express_validator_1.checkSchema)(users_1.userPOST);
exports.validatePatchUser = (0, express_validator_1.checkSchema)(users_1.userPATCH);
const bodyValidationUser = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, users_1.userPOST);
};
exports.bodyValidationUser = bodyValidationUser;
// Company
exports.validatePostCompany = (0, express_validator_1.checkSchema)(company_1.companyPOST);
exports.validatePatchCompany = (0, express_validator_1.checkSchema)(company_1.companyPATCH);
const bodyValidationCompany = (req, res, next) => {
    console.log((0, express_validator_1.validationResult)(req));
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, company_1.companyPOST);
};
exports.bodyValidationCompany = bodyValidationCompany;
// Permission
exports.validatePostPermission = (0, express_validator_1.checkSchema)(permissions_1.permissionsPOST);
exports.validatePatchPermissions = (0, express_validator_1.checkSchema)(permissions_1.permissionPATCH);
const bodyValidationPermissions = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, permissions_1.permissionsPOST);
};
exports.bodyValidationPermissions = bodyValidationPermissions;
// Legal
exports.validatePostLegal = (0, express_validator_1.checkSchema)(legalPerson_1.legalPOST);
exports.validatePatchLegal = (0, express_validator_1.checkSchema)(legalPerson_1.legalPATCH);
const bodyValidationLegal = (req, res, next) => {
    console.log('validationResult(req)', (0, express_validator_1.validationResult)(req));
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, legalPerson_1.legalPOST);
};
exports.bodyValidationLegal = bodyValidationLegal;
// Normal
exports.validatePostNormal = (0, express_validator_1.checkSchema)(normalPerson_1.normalPOST);
exports.validatePatchNormal = (0, express_validator_1.checkSchema)(normalPerson_1.normalPATCH);
const bodyValidationNormal = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, normalPerson_1.normalPOST);
};
exports.bodyValidationNormal = bodyValidationNormal;
// Segments
exports.validatePostPersonSegments = (0, express_validator_1.checkSchema)(personSegments_1.personSegmentsPOST);
exports.validatePatchPersonSegments = (0, express_validator_1.checkSchema)(personSegments_1.personSegmentsPATCH);
const bodyValidationPersonSegments = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, personSegments_1.personSegmentsPOST);
};
exports.bodyValidationPersonSegments = bodyValidationPersonSegments;
// Segments
exports.validatePostSegments = (0, express_validator_1.checkSchema)(segments_1.segmentsPOST);
exports.validatePatchSegments = (0, express_validator_1.checkSchema)(segments_1.segmentsPATCH);
const bodyValidationSegment = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, segments_1.segmentsPOST);
};
exports.bodyValidationSegment = bodyValidationSegment;
// Status
exports.validatePostStatus = (0, express_validator_1.checkSchema)(status_1.statusPOST);
exports.validatePatchStatus = (0, express_validator_1.checkSchema)(status_1.statusPATCH);
const bodyValidationStatus = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, status_1.statusPOST);
};
exports.bodyValidationStatus = bodyValidationStatus;
// Products
exports.validatePostProducts = (0, express_validator_1.checkSchema)(products_1.productsPOST);
exports.validatePatchProducts = (0, express_validator_1.checkSchema)(products_1.productsPATCH);
const bodyValidationProducts = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, products_1.productsPOST);
};
exports.bodyValidationProducts = bodyValidationProducts;
// Orders
exports.validatePostOrders = (0, express_validator_1.checkSchema)(orders_1.ordersPOST);
exports.validatePatchOrders = (0, express_validator_1.checkSchema)(orders_1.ordersPATCH);
const bodyValidationOrders = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, orders_1.ordersPOST);
};
exports.bodyValidationOrders = bodyValidationOrders;
// OrderProductStatus
exports.validatePostOrderProductStatus = (0, express_validator_1.checkSchema)(orderProductStatus_1.ordersProductStatusPOST);
exports.validatePatchOrderProductStatus = (0, express_validator_1.checkSchema)(orderProductStatus_1.ordersProductStatusPATCH);
const bodyValidationOrderProductStatus = (req, res, next) => {
    return !(0, express_validator_1.validationResult)(req).isEmpty() ? (0, bodyValidations_1.invalidValues)(res, req) : (0, bodyValidations_1.unexpectedFieldsFn)(req, res, next, orderProductStatus_1.ordersProductStatusPOST);
};
exports.bodyValidationOrderProductStatus = bodyValidationOrderProductStatus;
