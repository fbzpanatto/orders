import { Request, Response, NextFunction } from 'express'
import { check, checkSchema, Schema, validationResult } from 'express-validator'
import { objectResponse } from '../utils/response'

export const validateId = check('id')
  .not().isEmpty()
  .isNumeric()

const addressesSchemaValidation: Schema = {
  add_street: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_number: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_zipcode: {
    optional: true,
    isLength: { options: { min: 8, max: 8 } },
    escape: true
  },
  add_city: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_neighborhood: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  created_at: {
    optional: true,
    isDate: true,
    escape: true
  },
  updated_at: {
    optional: true,
    isDate: true,
    escape: true
  }
}

export const validatePostAddresses = checkSchema({
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  ...addressesSchemaValidation
})

export const validatePatchAddresses = checkSchema(addressesSchemaValidation)

const normal_schema_POST = {
  cpf: {
    exists: true,
    optional: false,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  middle_name: {
    optional: true,
    escape: true
  },
  last_name: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  }
}

const legal_schema_POST = {
  cnpj: {
    exists: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  corporate_name: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  social_name: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  state_registration: {
    exists: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  }
}

const normal_schema_PATCH = {
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  middle_name: {
    optional: true,
    escape: true
  },
  last_name: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  }
}

const legal_schema_PATCH = {
  cnpj: {
    optional: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  corporate_name: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  social_name: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  state_registration: {
    optional: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  }
}

export const validatePostLegal = checkSchema(legal_schema_POST);
export const validatePostNormal = checkSchema(normal_schema_POST);
export const validatePatchLegal = checkSchema(legal_schema_PATCH);
export const validatePatchNormal = checkSchema(normal_schema_PATCH);


export const bodyValidationNormal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, normal_schema_POST)
};

export const bodyValidationLegal = (req: Request, res: Response, next: NextFunction) => {
  return !validationResult(req).isEmpty() ? invalidValues(res) : unexpectedFieldsFn(req, res, next, legal_schema_POST)
};

const invalidValues = (res: Response) => {
  return res.status(400).json(objectResponse(400, 'Valor(es) inválido(s) no corpo da requisição.'))
}

const unexpectedFieldsFn = (req: Request, res: Response, next: NextFunction, schema: { [key: string]: any }) => {
  const unexpectedFields = Object.keys(req.body).filter(key => !schema.hasOwnProperty(key));
  return unexpectedFields.length ? res.status(400).json(objectResponse(400, 'Campo(s) inesperado(s) no corpo da requisição.')) : next()
}