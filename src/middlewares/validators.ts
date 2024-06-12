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

export const validateId = check('id').not().isEmpty().isNumeric()
export const validatePersonId = check('personId').not().isEmpty().isNumeric()
export const validateContactId = check('contactId').not().isEmpty().isNumeric()

// Company
export const validatePostCompany = checkSchema(companyPOST);
export const validatePatchCompany = checkSchema(companyPATCH);
export const bodyValidationCompany = (req: Request, res: Response, next: NextFunction) => {
  console.log('validationResult(req)', validationResult(req))
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, companyPOST)
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