import { Request, Response, NextFunction } from 'express'
import { check, checkSchema, validationResult } from 'express-validator'
import { objectResponse } from '../utils/response'
import { legalPATCH, legalPOST } from '../schemas/legalPerson'
import { normalPATCH, normalPOST } from '../schemas/normalPerson'
import { addressesPATCH, addressesPOST } from '../schemas/addresses'

export const validateId = check('id').not().isEmpty().isNumeric()

export const validatePostAddresses = checkSchema(addressesPOST)
export const validatePatchAddresses = checkSchema(addressesPATCH)

export const validatePostLegal = checkSchema(legalPOST);
export const validatePostNormal = checkSchema(normalPOST);

export const validatePatchLegal = checkSchema(legalPATCH);
export const validatePatchNormal = checkSchema(normalPATCH);

export const bodyValidationNormal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, normalPOST)
};

export const bodyValidationLegal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, legalPOST)
};

const invalidValues = (res: Response) => {
  return res.status(400).json(objectResponse(400, 'Valor(es) inválido(s) no corpo da requisição.'))
}

const unexpectedFieldsFn = (req: Request, res: Response, next: NextFunction, schema: { [key: string]: any }) => {
  const unexpectedFields = Object.keys(req.body).filter(key => !schema.hasOwnProperty(key));
  return unexpectedFields.length ? res.status(400).json(objectResponse(400, 'Campo(s) inesperado(s) no corpo da requisição.')) : next()
}