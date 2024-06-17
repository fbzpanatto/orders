import { Schema } from "express-validator";

export const userPOST: Schema = {
  user_id: {
    optional: true,
    escape: true,
  },
  company_id: {
    exists: true,
    escape: true,
  },
  role_id: {
    exists: true,
    escape: true
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
    isLength: { options: { min: 8, max: 8 } },
  }
}

export const userPATCH: Schema = {
  user_id: {
    optional: true,
    escape: true,
  },
  company_id: {
    optional: true,
    escape: true,
  },
  role_id: {
    optional: true,
    escape: true
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
    isLength: { options: { min: 8, max: 8 } },
  }
}