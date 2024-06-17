export const statusPOST = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
}

export const statusPATCH = {
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  }
}

