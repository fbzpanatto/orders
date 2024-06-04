export const addressesPOST = {
  add_street: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  add_number: {
    exists: true,
    isLength: { options: { max: 10 } },
    escape: true
  },
  add_zipcode: {
    exists: true,
    isLength: { options: { min: 8, max: 8 } },
    escape: true
  },
  add_city: {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  add_neighborhood: {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  }
}

export const addressesPATCH = {
  add_street: {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  add_number: {
    optional: true,
    isLength: { options: { max: 10 } },
    escape: true
  },
  add_zipcode: {
    optional: true,
    isLength: { options: { min: 8, max: 8 } },
    escape: true
  },
  add_city: {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  add_neighborhood: {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  }
}