export const segmentsPOST = {
  segment_id: {
    optional: true
  },
  company_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 20 } },
    escape: true
  },
}

export const segmentsPATCH = {
  segment_id: {
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
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 20 } },
    escape: true
  },
}