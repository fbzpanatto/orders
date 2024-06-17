import { Schema } from "express-validator";

const base: Schema = {
  role: { exists: true },
  customers: { optional: true },
  companies: { optional: true },
  orders: { optional: true },
  permissions: { optional: true },
  products: { optional: true },
  segments: { optional: true },
  production_status: { optional: true },
  users: { optional: true },
  'role.role_id': {
    optional: true
  },
  'role.role_name': {
    optional: true,
    isLength: { options: { min: 3, max: 30 } },
    escape: true
  },
  'customers.permission_id': {
    optional: true
  },
  'customers.role_id': {
    optional: true
  },
  'customers.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'customers.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'customers.canUpdate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.permission_id': {
    optional: true
  },
  'companies.role_id': {
    optional: true
  },
  'companies.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'companies.canUpdate': {
    optional: true,
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
  'orders.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'orders.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'orders.canUpdate': {
    optional: true,
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
  'permissions.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'permissions.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'permissions.canUpdate': {
    optional: true,
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
  'products.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'products.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'products.canUpdate': {
    optional: true,
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
  'segments.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'segments.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'segments.canUpdate': {
    optional: true,
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
  'production_status.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'production_status.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'production_status.canUpdate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.permission_id': {
    optional: true
  },
  'users.role_id': {
    optional: true
  },
  'users.canCreate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.canRead': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
  'users.canUpdate': {
    optional: true,
    escape: true,
    isBoolean: true,
    toBoolean: true
  },
};

export const permissionsPOST: Schema = { ...base };

export const permissionPATCH: Schema = { ...base };
