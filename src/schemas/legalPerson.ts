import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"
import { Schema } from 'express-validator'

export const legalPOST: Schema = {
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
  },
  add_street: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_number: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_zipcode: {
    exists: true,
    isLength: { options: { min: 8, max: 8 } },
    escape: true
  },
  add_city: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_neighborhood: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  contacts: {
    optional: true,
    escape: true,
    isArray: true
  },
  created_at: {
    exists: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  updated_at: {
    optional: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  ...optionalFields,
}

export const legalPATCH: Schema = {
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
  },
  add_street: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_number: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_zipcode: {
    exists: true,
    isLength: { options: { min: 8, max: 8 } },
    escape: true
  },
  add_city: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  add_neighborhood: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  contacts: {
    optional: true,
    escape: true,
    isArray: true
  },
  created_at: {
    optional: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  updated_at: {
    exists: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  },
  ...optionalFields,
}