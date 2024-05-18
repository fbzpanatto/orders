import { validateCustomFieldDate } from "../utils/customValidators"

export const ordersProductStatusPOST = {
  order_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  product_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  status_id: {
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

export const ordersProductStatusPATCH = {
  status_id: {
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
    optional: true,
    escape: true,
    custom: {
      options: validateCustomFieldDate
    }
  }
}