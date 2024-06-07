import { Schema } from 'express-validator'
import { addressesPOST, addressesPATCH } from "./addresses"

const legalCustomerPOST: Schema = {
  'customer.person_id': {
    optional: true
  },
  'customer.cnpj': {
    exists: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  'customer.corporate_name': {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'customer.social_name': {
    exists: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'customer.state_registration': {
    exists: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
}

const legalCustomerPATCH: Schema = {
  'customer.person_id': {
    optional: true
  },
  'customer.cnpj': {
    optional: true,
    isLength: { options: { min: 14, max: 14 } },
    escape: true
  },
  'customer.corporate_name': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'customer.social_name': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'customer.state_registration': {
    optional: true,
    isLength: { options: { min: 9, max: 9 } },
    escape: true
  },
}

export const legalPOST: Schema = {
  customer: { exists: true },
  address: { exists: true },
  contacts: { optional: true },
  ...legalCustomerPOST,
  ...addressesPOST
}

export const legalPATCH: Schema = {
  customer: { optional: true },
  contacts: { optional: true },
  address: { optional: true },
  ...legalCustomerPATCH,
  ...addressesPATCH
}