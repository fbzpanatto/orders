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
  last_name: {
    optional: true,
    isLength: { options: { min: 3 } }
  },
  cnpj: {
    optional: true,
    isLength: { options: { min: 14, max: 14 } }
  },
});