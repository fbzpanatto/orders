import { check, checkSchema } from 'express-validator'

export const validateId = check('id')
  .not().isEmpty()
  .isNumeric()

export const validatePostCustomer = checkSchema({
  'person_category.id': {
    exists: true
  },
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } }
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  middle_name: {
    optional: true,
    isLength: { options: { min: 2 } }
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
});

export const validatePatchCustomer = checkSchema({
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } }
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  middle_name: {
    optional: true,
    isLength: { options: { min: 2 } }
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
});