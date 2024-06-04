import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"

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
    isLength: { options: { min: 2, max: 60 } },
    escape: true
  },
  last_name: {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
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
  ...optionalFields
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
    isLength: { options: { min: 2, max: 60 } },
    escape: true
  },
  last_name: {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
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
  ...optionalFields
}