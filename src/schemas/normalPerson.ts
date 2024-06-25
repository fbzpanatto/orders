import { addressesPOST, addressesPATCH } from "./addresses"
import { person } from "./complementary"
import { Schema } from "express-validator"

const normalCustomerPOST: Schema = {
  'customer.person_id': { 
    optional: true
  },
  'customer.cpf': {
    exists: true,
    optional: false,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  'customer.first_name': {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  'customer.middle_name': {
    optional: true,
    isLength: { options: { max: 60 } },
    escape: true
  },
  'customer.last_name': {
    exists: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  'customer.created_at': {
    optional: true,
    escape: true
  },
}

const normalCustomerPATCH: Schema = {
  'customer.person_id': {
    optional: true
  },
  'customer.cpf': {
    optional: true,
    isLength: { options: { min: 11, max: 11 } },
    escape: true
  },
  'customer.first_name': {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  'customer.middle_name': {
    optional: true,
    isLength: { options: { max: 60 } },
    escape: true
  },
  'customer.last_name': {
    optional: true,
    isLength: { options: { min: 3, max: 60 } },
    escape: true
  },
  'customer.created_at': {
    optional: true,
    escape: true
  },
}

export const normalPOST: Schema = {
  company: { optional: true },
  customer: { exists: true },
  address: { exists: true },
  person: { optional: true },
  contacts: { optional: true },
  segments: { optional: true },
  ...normalCustomerPOST,
  ...addressesPOST,
  ...person
}

export const normalPATCH: Schema = {
  company: { optional: true },
  customer: { optional: true },
  address: { optional: true },
  person: { optional: true },
  contacts: { optional: true },
  segments: { optional: true },
  ...normalCustomerPATCH,
  ...addressesPATCH,
  ...person
}