import { check, checkSchema, Schema } from 'express-validator'

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

const normal_schema_POST: Schema = {
  cpf: {
    optional: false,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    optional: false,
    isLength: { options: { min: 3 } },
    escape: true
  },
  middle_name: {
    optional: true,
    escape: true
  },
  last_name: {
    optional: false,
    isLength: { options: { min: 3 } },
    escape: true
  }
}

const legal_schema_POST: Schema = {
  cnpj: {
    optional: false,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  corporate_name: {
    optional: false,
    isLength: { options: { min: 3 } },
    escape: true
  },
  social_name: {
    optional: false,
    isLength: { options: { min: 3 } },
    escape: true
  },
  state_registration: {
    optional: false,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  }
}

const normal_schema_PATCH: Schema = {
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

const legal_schema_PATCH: Schema = {
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