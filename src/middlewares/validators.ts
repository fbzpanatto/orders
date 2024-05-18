import { Request, Response, NextFunction } from 'express'
import { check, checkSchema, validationResult } from 'express-validator'
import { unexpectedFieldsFn, invalidValues } from '../utils/bodyValidations'

import { legalPATCH, legalPOST } from '../schemas/legalPerson'
import { normalPATCH, normalPOST } from '../schemas/normalPerson'
import { addressesPATCH, addressesPOST } from '../schemas/addresses'
import { phonesPATCH, phonesPOST } from '../schemas/phones'
import { segmentsPATCH, segmentsPOST } from '../schemas/segments'
import { personSegmentsPATCH, personSegmentsPOST } from '../schemas/personSegments'
import { statusPATCH, statusPOST } from '../schemas/status'
import { productsPOST, productsPATCH } from '../schemas/products'
import { ordersPOST, ordersPATCH } from '../schemas/orders'
import { ordersProductStatusPOST, ordersProductStatusPATCH } from '../schemas/order_products_status'

export const validateId = check('id').not().isEmpty().isNumeric()
export const validatePersonId = check('personId').not().isEmpty().isNumeric()

// Legal
export const validatePatchLegal = checkSchema(legalPATCH);
export const validatePatchNormal = checkSchema(normalPATCH);
export const bodyValidationNormal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, normalPOST)
};

// Normal
export const validatePostLegal = checkSchema(legalPOST);
export const validatePostNormal = checkSchema(normalPOST);
export const bodyValidationLegal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, legalPOST)
};

// Address
export const validatePostAddresses = checkSchema(addressesPOST)
export const validatePatchAddresses = checkSchema(addressesPATCH)
export const bodyValidationAddress = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, addressesPOST)
};

// Segments
export const validatePostPersonSegments = checkSchema(personSegmentsPOST)
export const validatePatchPersonSegments = checkSchema(personSegmentsPATCH)
export const bodyValidationPersonSegments = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, personSegmentsPOST)
};

// Phone
export const validatePostPhones = checkSchema(phonesPOST)
export const validatePatchPhones = checkSchema(phonesPATCH)
export const bodyValidationPhone = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, phonesPOST)
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

// Orders
export const validatePostOrderProductStatus = checkSchema(ordersProductStatusPOST)
export const validatePatchProductStatus = checkSchema(ordersProductStatusPATCH)
export const bodyValidationProductStatus = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res, req) : unexpectedFieldsFn(req, res, next, ordersProductStatusPOST)
};


