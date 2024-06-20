interface BaseFields {
  permission_id?: number,
  role_id?: number,
  company_id?: number,
  canCreate?: boolean,
  canRead?: boolean,
  canUpdate?: boolean
}

export interface Permission {
  company?: { company_id: number },
  role?: { role_id: number, role_name: string },
  customers?: BaseFields
  orders?: BaseFields,
  permissions?: BaseFields,
  products?: BaseFields,
  segments?: BaseFields,
  production_status?: BaseFields,
  users?: BaseFields,
}