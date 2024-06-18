import { Schema } from "express-validator";

export const fieldPOST: Schema = {
  table_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  field: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  },
  label: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  }
}

export const fieldPATCH: Schema = {
  table_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  field: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  },
  label: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  }
}