export const phonesPOST = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  phone_number: {
    exists: true,
    isLength: { options: { min: 3, max: 15 } },
    escape: true
  },
  contact: {
    exists: true,
    isLength: { options: { min: 3, max: 45 } },
    escape: true
  },
  created_at: {
    exists: true,
    escape: true
  },
  updated_at: {
    optional: true,
    escape: true
  }
}

export const phonesPATCH = {
  phone_number: {
    optional: true,
    isLength: { options: { min: 3, max: 15 } },
    escape: true
  },
  contact: {
    optional: true,
    isLength: { options: { min: 3, max: 45 } },
    escape: true
  },
  created_at: {
    optional: true,
    escape: true
  },
  updated_at: {
    exists: true,
    escape: true
  }
}