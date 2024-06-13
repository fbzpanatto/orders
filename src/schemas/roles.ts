import { Schema } from "express-validator"

export const rolesPOST: Schema = {
  role_id: {
    optional: true
  },
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  }
}

export const rolesPATCH: Schema = {
  role_id: {
    optional: true
  },
  name: {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  }
}