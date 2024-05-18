import { validateCustomFieldDate } from "../utils/customValidators"
import { optionalFields } from "./optionalFields"

export const legalPOST = {
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

export const legalPATCH = {
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