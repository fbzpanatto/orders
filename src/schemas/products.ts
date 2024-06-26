import { validateCustomFieldDate } from "../utils/customValidators"

export const productsPOST = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
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
  }
}

export const productsPATCH = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
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
  }
}

