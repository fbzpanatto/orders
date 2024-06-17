interface BaseFields {
  permission_id?: number,
  role_id?: number,
  canCreate?: boolean,
  canRead?: boolean,
  canUpdate?: boolean
}

export interface Permission {
  role?: { role_id: number, role_name: string },
  customers?: BaseFields
  companies?: BaseFields,
  orders?: BaseFields,
  permissions?: BaseFields,
  products?: BaseFields,
  segments?: BaseFields,
  production_status?: BaseFields,
  users?: BaseFields,
}