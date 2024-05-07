import { check, checkSchema, Schema } from 'express-validator'

export const validateId = check('id')
  .not().isEmpty()
  .isNumeric()

const addressesSchemaValidation: Schema = {
  add_street: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  add_number: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  add_zipcode: {
    optional: true,
    isLength: { options: { min: 8, max: 8 } }
  },
  add_city: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  add_neighborhood: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  created_at: {
    optional: true,
    isDate: true
  },
  updated_at: {
    optional: true,
    isDate: true
  }
}

export const validatePostAddresses = checkSchema({
  person_id: {
    exists: true,
    isNumeric: true
  },
  ...addressesSchemaValidation
})

export const validatePatchAddresses = checkSchema(addressesSchemaValidation)

const customerSchemaValidation: Schema = {
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } }
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  middle_name: {
    optional: true
  },
  last_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  cnpj: {
    optional: true,
    isLength: { options: { min: 14, max: 14 } }
  },
  corporate_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  social_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  state_registration: {
    optional: true,
    isLength: { options: { min: 9, max: 9 } }
  }
}

export const validatePostCustomer = checkSchema({
  person_category_id: { exists: true },
  ...customerSchemaValidation
});

export const validatePatchCustomer = checkSchema(customerSchemaValidation);