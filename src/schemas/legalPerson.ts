import { Schema } from 'express-validator'
import { person } from './complementary'
import { addressesPOST, addressesPATCH } from "./addresses"

const legalCustomerPOST: Schema = {
  'customer.person_id': {
    optional: true
  },
  'customer.company_id': {
    exists: true,
    escape: true,
    isInt: true,
    toInt: true
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
    optional: true,
    escape: true,
    isInt: true,
    toInt: true
  },
  'customer.company_id': {
    optional: true,
    escape: true,
    isInt: true,
    toInt: true
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
  company: { optional: true },
  customer: { exists: true },
  address: { exists: true },
  person: { exists: true },
  contacts: { optional: true },
  segments: { optional: true },
  ...legalCustomerPOST,
  ...addressesPOST,
  ...person
}

export const legalPATCH: Schema = {
  company: { optional: true },
  customer: { optional: true },
  address: { optional: true },
  person: { optional: true },
  contacts: { optional: true },
  segments: { optional: true },
  ...legalCustomerPATCH,
  ...addressesPATCH,
  ...person
}