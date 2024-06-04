import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"
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

export const normalPOST = {
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
  ...addressesPOST,
  ...optionalFields,
}

export const normalPATCH = {
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
  ...addressesPATCH,
  ...optionalFields,
}