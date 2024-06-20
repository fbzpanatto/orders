import { Schema } from "express-validator";

const base: Schema = {
  role: { exists: true },
  company: { exists: true },
  customers: { exists: true },
  companies: { exists: true },
  orders: { exists: true },
  permissions: { exists: true },
  products: { exists: true },
  segments: { exists: true },
  production_status: { exists: true },
  users: { exists: true },
  'role.role_id': {
    exists: true
  },
  'role.role_name': {
    exists: true,
    isLength: { options: { min: 3, max: 30 } },
    escape: true
  },
  'company.company_id': {
    exists: true
  },
  'customers.permission_id': {
    exists: true,
  },
  'customers.company_id': {
    optional: true
  },
  'customers.role_id': {
    exists: true,
  },
  'customers.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'customers.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'customers.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.permission_id': {
    exists: true,
  },
  'companies.company_id': {
    exists: true,
  },
  'companies.role_id': {
    exists: true,
  },
  'companies.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'orders.permission_id': {
    optional: true
  },
  'orders.role_id': {
    optional: true
  },
  'orders.company_id': {
    optional: true
  },
  'orders.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'orders.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'orders.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'permissions.permission_id': {
    optional: true
  },
  'permissions.role_id': {
    optional: true
  },
  'permissions.company_id': {
    optional: true
  },
  'permissions.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'permissions.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'permissions.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'products.permission_id': {
    optional: true
  },
  'products.role_id': {
    optional: true
  },
  'products.company_id': {
    optional: true
  },
  'products.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'products.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'products.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'segments.permission_id': {
    optional: true
  },
  'segments.role_id': {
    optional: true
  },
  'segments.company_id': {
    optional: true
  },
  'segments.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'segments.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'segments.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'production_status.permission_id': {
    optional: true
  },
  'production_status.role_id': {
    optional: true
  },
  'production_status.company_id': {
    optional: true
  },
  'production_status.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'production_status.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'production_status.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.permission_id': {
    optional: true
  },
  'users.company_id': {
    optional: true
  },
  'users.role_id': {
    optional: true
  },
  'users.canCreate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.canRead': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.canUpdate': {
    exists: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
};

export const permissionsPOST: Schema = { ...base };

export const permissionPATCH: Schema = { ...base };
