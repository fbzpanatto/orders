export const RESOURCES_NAME_TO_ID = {
  customers: 1,
  companies: 2,
  orders: 3,
  permissions: 4,
  products: 5,
  segments: 6,
  production_status: 7,
  users: 8
}

export const RESOURCES_ID_TO_NAME = {
  1: 'customers',
  2: 'companies',
  3: 'orders',
  4: 'permissions',
  5: 'products',
  6: 'segments',
  7: 'production_status',
  8: 'users'
}

export const CONFIGURABLE_RESOURCES_AND_FIELDS = [
  {
    id: 1,
    resource: 'customers',
    label: 'Clientes',
    fields: [
      {
        id: 1,
        field: 'first_field'
      },
      {
        id: 2,
        field: 'second_field'
      },
      {
        id: 3,
        field: 'third_field'
      }
    ]
  },
  // {
  //   id: 2,
  //   resource: 'companies',
  //   label: 'Empresas',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 3,
  //   resource: 'orders',
  //   label: 'Pedidos',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 4,
  //   resource: 'permissions',
  //   label: 'Permissões',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 5,
  //   resource: 'products',
  //   label: 'Produtos',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 6,
  //   resource: 'segments',
  //   label: 'Segmentos',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 7,
  //   resource: 'production_status',
  //   label: 'Status do Produto',
  //   fields: [
  //     {

  //     }
  //   ]
  // },
  // {
  //   id: 8,
  //   resource: 'users',
  //   label: 'Usuários',
  //   fields: [
  //     {

  //     }
  //   ]
  // }
]