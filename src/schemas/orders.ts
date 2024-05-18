import { Schema } from 'express-validator'
import { validateCustomFieldDate } from '../utils/customValidators'

export const ordersPOST = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  started_at: {
    exists: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  ended_at: {
    optional: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  }
}



export const ordersPATCH: Schema = {
  person_id: {
    optional: true,
    isNumeric: true,
    escape: true
  },
  started_at: {
    optional: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  ended_at: {
    exists: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  }
}