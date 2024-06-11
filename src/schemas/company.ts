import { addressesPOST, addressesPATCH } from "./addresses"
import { Schema } from "express-validator"

export const companyPOST: Schema = {
  company: { exists: true },
  address: { exists: true },
  'company.id': {
    optional: true
  },
  'company.cnpj': {
    exists: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  'company.state_registration': {
    exists: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
  'company.corporate_name': {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'company.social_name': {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'company.active': {
    exists: true,
    isBoolean: true
  },
  ...addressesPOST,
}

export const companyPATCH: Schema = {
  company: { optional: true },
  address: { optional: true },
  'company.id': {
    optional: true,
  },
  'company.cnpj': {
    optional: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  'company.state_registration': {
    optional: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
  'company.corporate_name': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'company.social_name': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'company.active': {
    optional: true,
    isBoolean: true
  },
  ...addressesPATCH,
}