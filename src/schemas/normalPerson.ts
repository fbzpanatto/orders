export const normalPOST = {
  cpf: {
    exists: true,
    optional: false,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    exists: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  middle_name: {
    optional: true,
    escape: true
  },
  last_name: {
    exists: true,
    isLength: { options: { min: 3 } },
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

export const normalPATCH = {
  cpf: {
    optional: true,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  first_name: {
    optional: true,
    isLength: { options: { min: 3 } },
    escape: true
  },
  middle_name: {
    optional: true,
    escape: true
  },
  last_name: {
    optional: true,
    isLength: { options: { min: 3 } },
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