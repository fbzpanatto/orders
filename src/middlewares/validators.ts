import { Request, Response, NextFunction } from 'express'
import { check, checkSchema, validationResult } from 'express-validator'
import { unexpectedFieldsFn, invalidValues } from '../utils/bodyValidations'

import { legalPATCH, legalPOST } from '../schemas/legalPerson'
import { normalPATCH, normalPOST } from '../schemas/normalPerson'
import { segmentsPATCH, segmentsPOST } from '../schemas/segments'
import { personSegmentsPATCH, personSegmentsPOST } from '../schemas/personSegments'
import { statusPATCH, statusPOST } from '../schemas/status'
import { productsPOST, productsPATCH } from '../schemas/products'
import { ordersPOST, ordersPATCH } from '../schemas/orders'
import { ordersProductStatusPOST, ordersProductStatusPATCH } from '../schemas/orderProductStatus'
import { companyPATCH, companyPOST } from '../schemas/company'
import { permissionPATCH, permissionsPOST } from '../schemas/permissions'
import { userPATCH, userPOST } from '../schemas/users'
import { fieldPATCH, fieldPOST } from '../schemas/fields'

export const validateId = check('id').not().isEmpty().isNumeric()
export const validatePersonId = check('personId').not().isEmpty().isNumeric()

// Field
export const validatePostField = checkSchema(fieldPOST);
export const validatePatchField = checkSchema(fieldPATCH);
export const bodyValidationField = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, fieldPOST)
};

// Company
export const validatePostUser = checkSchema(userPOST);
export const validatePatchUser = checkSchema(userPATCH);
export const bodyValidationUser = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, userPOST)
};

// Company
export const validatePostCompany = checkSchema(companyPOST);
export const validatePatchCompany = checkSchema(companyPATCH);
export const bodyValidationCompany = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, companyPOST)
};

// Permission
export const validatePostPermission = checkSchema(permissionsPOST);
export const validatePatchPermissions = checkSchema(permissionPATCH);
export const bodyValidationPermissions = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, permissionsPOST)
};

// Legal
export const validatePostLegal = checkSchema(legalPOST);
export const validatePatchLegal = checkSchema(legalPATCH);
export const bodyValidationLegal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, legalPOST)
};

// Normal
export const validatePostNormal = checkSchema(normalPOST);
export const validatePatchNormal = checkSchema(normalPATCH);
export const bodyValidationNormal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, normalPOST)
};

// Segments
export const validatePostPersonSegments = checkSchema(personSegmentsPOST)
export const validatePatchPersonSegments = checkSchema(personSegmentsPATCH)
export const bodyValidationPersonSegments = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, personSegmentsPOST)
};

// Segments
export const validatePostSegments = checkSchema(segmentsPOST)
export const validatePatchSegments = checkSchema(segmentsPATCH)
export const bodyValidationSegment = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, segmentsPOST)
};

// Status
export const validatePostStatus = checkSchema(statusPOST)
export const validatePatchStatus = checkSchema(statusPATCH)
export const bodyValidationStatus = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, statusPOST)
};

// Products
export const validatePostProducts = checkSchema(productsPOST)
export const validatePatchProducts = checkSchema(productsPATCH)
export const bodyValidationProducts = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, productsPOST)
};

// Orders
export const validatePostOrders = checkSchema(ordersPOST)
export const validatePatchOrders = checkSchema(ordersPATCH)
export const bodyValidationOrders = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, ordersPOST)
};

// OrderProductStatus
export const validatePostOrderProductStatus = checkSchema(ordersProductStatusPOST)
export const validatePatchOrderProductStatus = checkSchema(ordersProductStatusPATCH)
export const bodyValidationOrderProductStatus = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, ordersProductStatusPOST)
}