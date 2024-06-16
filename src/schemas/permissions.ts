import { Schema } from "express-validator"

export const permissionsPOST: Schema = {
  role: { exists: true },
  customers: { exists: true },
  companies: { exists: true },
  orders: { exists: true },
  permissions: { exists: true },
  products: { exists: true },
  segments: { exists: true },
  production_status: { exists: true },
  users: { exists: true },
  'role.role_id': {
    exists: true,
    escape: true
  },
  'role.role_name': {
    exists: true,
    escape: true
  },
  'customers.permission_id': {
    exists: true,
    escape: true
  },
  'customers.role_id': {
    exists: true,
    escape: true
  },
  'customers.create': {
    exists: true,
    escape: true
  },
  'customers.read': {
    exists: true,
    escape: true
  },
  'customers.update': {
    exists: true,
    escape: true
  },
  'companies.permission_id': {
    exists: true,
    escape: true
  },
  'companies.role_id': {
    exists: true,
    escape: true
  },
  'companies.create': {
    exists: true,
    escape: true
  },
  'companies.read': {
    exists: true,
    escape: true
  },
  'companies.update': {
    exists: true,
    escape: true
  },
  'orders.permission_id': {
    exists: true,
    escape: true
  },
  'orders.role_id': {
    exists: true,
    escape: true
  },
  'orders.create': {
    exists: true,
    escape: true
  },
  'orders.read': {
    exists: true,
    escape: true
  },
  'orders.update': {
    exists: true,
    escape: true
  },
  'permissions.permission_id': {
    exists: true,
    escape: true
  },
  'permissions.role_id': {
    exists: true,
    escape: true
  },
  'permissions.create': {
    exists: true,
    escape: true
  },
  'permissions.read': {
    exists: true,
    escape: true
  },
  'permissions.update': {
    exists: true,
    escape: true
  },
  'products.permission_id': {
    exists: true,
    escape: true
  },
  'products.role_id': {
    exists: true,
    escape: true
  },
  'products.create': {
    exists: true,
    escape: true
  },
  'products.read': {
    exists: true,
    escape: true
  },
  'products.update': {
    exists: true,
    escape: true
  },
  'segments.permission_id': {
    exists: true,
    escape: true
  },
  'segments.role_id': {
    exists: true,
    escape: true
  },
  'segments.create': {
    exists: true,
    escape: true
  },
  'segments.read': {
    exists: true,
    escape: true
  },
  'segments.update': {
    exists: true,
    escape: true
  },
  'production_status.permission_id': {
    exists: true,
    escape: true
  },
  'production_status.role_id': {
    exists: true,
    escape: true
  },
  'production_status.create': {
    exists: true,
    escape: true
  },
  'production_status.read': {
    exists: true,
    escape: true
  },
  'production_status.update': {
    exists: true,
    escape: true
  },
  'users.permission_id': {
    exists: true,
    escape: true
  },
  'users.role_id': {
    exists: true,
    escape: true
  },
  'users.create': {
    exists: true,
    escape: true
  },
  'users.read': {
    exists: true,
    escape: true
  },
  'users.update': {
    exists: true,
    escape: true
  },
}

export const permissionPATCH: Schema = {
  role: { optional: true },
  customers: { optional: true },
  companies: { optional: true },
  orders: { optional: true },
  permissions: { optional: true },
  products: { optional: true },
  segments: { optional: true },
  production_status: { optional: true },
  users: { optional: true },
  'role.role_id': {
    optional: true,
    escape: true
  },
  'role.role_name': {
    optional: true,
    escape: true
  },
  'customers.permission_id': {
    optional: true,
    escape: true
  },
  'customers.role_id': {
    optional: true,
    escape: true
  },
  'customers.create': {
    optional: true,
    escape: true
  },
  'customers.read': {
    optional: true,
    escape: true
  },
  'customers.update': {
    optional: true,
    escape: true
  },
  'companies.permission_id': {
    optional: true,
    escape: true
  },
  'companies.role_id': {
    optional: true,
    escape: true
  },
  'companies.create': {
    optional: true,
    escape: true
  },
  'companies.read': {
    optional: true,
    escape: true
  },
  'companies.update': {
    optional: true,
    escape: true
  },
  'orders.permission_id': {
    optional: true,
    escape: true
  },
  'orders.role_id': {
    optional: true,
    escape: true
  },
  'orders.create': {
    optional: true,
    escape: true
  },
  'orders.read': {
    optional: true,
    escape: true
  },
  'orders.update': {
    optional: true,
    escape: true
  },
  'permissions.permission_id': {
    optional: true,
    escape: true
  },
  'permissions.role_id': {
    optional: true,
    escape: true
  },
  'permissions.create': {
    optional: true,
    escape: true
  },
  'permissions.read': {
    optional: true,
    escape: true
  },
  'permissions.update': {
    optional: true,
    escape: true
  },
  'products.permission_id': {
    optional: true,
    escape: true
  },
  'products.role_id': {
    optional: true,
    escape: true
  },
  'products.create': {
    optional: true,
    escape: true
  },
  'products.read': {
    optional: true,
    escape: true
  },
  'products.update': {
    optional: true,
    escape: true
  },
  'segments.permission_id': {
    optional: true,
    escape: true
  },
  'segments.role_id': {
    optional: true,
    escape: true
  },
  'segments.create': {
    optional: true,
    escape: true
  },
  'segments.read': {
    optional: true,
    escape: true
  },
  'segments.update': {
    optional: true,
    escape: true
  },
  'production_status.permission_id': {
    optional: true,
    escape: true
  },
  'production_status.role_id': {
    optional: true,
    escape: true
  },
  'production_status.create': {
    optional: true,
    escape: true
  },
  'production_status.read': {
    optional: true,
    escape: true
  },
  'production_status.update': {
    optional: true,
    escape: true
  },
  'users.permission_id': {
    optional: true,
    escape: true
  },
  'users.role_id': {
    optional: true,
    escape: true
  },
  'users.create': {
    optional: true,
    escape: true
  },
  'users.read': {
    optional: true,
    escape: true
  },
  'users.update': {
    optional: true,
    escape: true
  },
}