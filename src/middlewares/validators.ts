import { Request, Response, NextFunction } from 'express'
import { check, checkSchema, validationResult } from 'express-validator'
import { unexpectedFieldsFn, invalidValues } from '../utils/bodyValidations'

import { legalPATCH, legalPOST } from '../schemas/legalPerson'
import { normalPATCH, normalPOST } from '../schemas/normalPerson'
import { addressesPATCH, addressesPOST } from '../schemas/addresses'
import { phonesPATCH, phonesPOST } from '../schemas/phones'

export const validateId = check('id').not().isEmpty().isNumeric()
export const validatePersonId = check('personId').not().isEmpty().isNumeric()

// Legal
export const validatePatchLegal = checkSchema(legalPATCH);
export const validatePatchNormal = checkSchema(normalPATCH);
export const bodyValidationNormal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, normalPOST)
};

// Normal
export const validatePostLegal = checkSchema(legalPOST);
export const validatePostNormal = checkSchema(normalPOST);
export const bodyValidationLegal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, legalPOST)
};

// Address
export const validatePostAddresses = checkSchema(addressesPOST)
export const validatePatchAddresses = checkSchema(addressesPATCH)
export const bodyValidationAddress = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, addressesPOST)
};

// Phone
export const validatePostPhones = checkSchema(phonesPOST)
export const validatePatchPhones = checkSchema(phonesPATCH)
export const bodyValidationPhone = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, phonesPOST)
};