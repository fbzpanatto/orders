export const ordersPOST = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  started_at: {
    exists: true,
    escape: true
  },
  ended_at: {
    optional: true,
    escape: true
  }
}

export const ordersPATCH = {
  started_at: {
    optional: true,
    escape: true
  },
  ended_at: {
    exists: true,
    escape: true
  }
}