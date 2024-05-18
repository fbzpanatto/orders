import { validateCustomFieldDate } from "../utils/customValidators"

export const personSegmentsPOST = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  segment_id: {
    exists: true,
    isNumeric: true,
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

export const personSegmentsPATCH = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  segment_id: {
    exists: true,
    isNumeric: true,
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