export const statusPOST = {
  status_id: {
    optional: true
  },
  company_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  next_status_id: {
    optional: true
  },
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 20 } },
    escape: true
  },
}

export const statusPATCH = {
  status_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  company_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  next_status_id: {
    optional: true
  },
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 20 } },
    escape: true
  },
}

