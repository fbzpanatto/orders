import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"
import { addressesPOST, addressesPATCH } from "./addresses"
import { Schema } from "express-validator"

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

export const normalPOST: Schema = {
  person_id: {
    optional: true
  },
  cpf: {
    exists: true,
    optional: false,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  middle_name: {
    optional: true,
    isLength: { options: { max: 60 } },
    escape: true
  },
  last_name: {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  contacts: {
    optional: true
  },
  address: {
    exists: true,
  },
  ...addressesPOST
}

export const normalPATCH: Schema = {
  person_id: {
    optional: true
  },
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  middle_name: {
    optional: true,
    isLength: { options: { max: 60 } },
    escape: true
  },
  last_name: {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  contacts: {
    optional: true
  },
  address: {
    optional: true,
  },
  ...addressesPATCH
}