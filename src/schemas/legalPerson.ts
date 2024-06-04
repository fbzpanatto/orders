import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"
import { Schema } from 'express-validator'
import { addressesPOST, addressesPATCH } from "./addresses"

// const createdAtUpdatedAt: Schema = {
//   created_at: {
//     optional: true,
//     escape: true,
//     custom: {
//       options: validateCustomFieldDate
//     }
//   },
//   updated_at: {
//     optional: true,
//     escape: true,
//     custom: {
//       options: validateCustomFieldDate
//     }
//   },
// }

export const legalPOST: Schema = {
  cnpj: {
    exists: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  corporate_name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  social_name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  state_registration: {
    exists: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
  contacts: {
    optional: true
  },
  ...addressesPOST,
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
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  social_name: {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  state_registration: {
    optional: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
  contacts: {
    optional: true
  },
  ...addressesPATCH,
  ...optionalFields,
}