import { check } from 'express-validator'

export const validateId = check('id')
  .not().isEmpty()
  .isNumeric()