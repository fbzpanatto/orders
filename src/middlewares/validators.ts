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
  cnpj: {
    optional: true,
    isLength: { options: { min: 14, max: 14 } }
  },
});