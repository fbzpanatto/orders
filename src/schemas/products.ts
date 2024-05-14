export const productsPOST = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
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

export const productsPATCH = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
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

