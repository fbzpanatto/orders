import { Schema } from "express-validator";

export const userPOST: Schema = {
  company_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  role_id: {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  name: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 45 } },
  },
  active: {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  username: {
    exists: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  },
  password: {
    exists: true,
    escape: true,
    isLength: { options: { min: 8, max: 20 } },
  }
}

export const userPATCH: Schema = {
  company_id: {
    optional: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  role_id: {
    optional: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  name: {
    optional: true,
    escape: true,
    isLength: { options: { min: 3, max: 45 } },
  },
  active: {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  username: {
    optional: true,
    escape: true,
    isLength: { options: { min: 3, max: 20 } },
  },
  password: {
    optional: true,
    escape: true,
    isLength: { options: { min: 8, max: 20 } },
  }
}