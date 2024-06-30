"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIGURABLE_RESOURCES_AND_FIELDS = exports.RESOURCES_ID_TO_NAME = exports.RESOURCES_NAME_TO_ID = void 0;
exports.RESOURCES_NAME_TO_ID = {
    customers: 1,
    companies: 2,
    orders: 3,
    permissions: 4,
    products: 5,
    segments: 6,
    production_status: 7,
    users: 8
};
exports.RESOURCES_ID_TO_NAME = {
    1: 'customers',
    2: 'companies',
    3: 'orders',
    4: 'permissions',
    5: 'products',
    6: 'segments',
    7: 'production_status',
    8: 'users'
};
exports.CONFIGURABLE_RESOURCES_AND_FIELDS = [
    {
        id: 1,
        resource: 'customers',
        label: 'Clientes',
        fields: [
            {
                id: 1,
                field: 'first_field',
                label: 'Primeiro Campo'
            },
            {
                id: 2,
                field: 'second_field',
                label: 'Segundo Campo'
            },
            {
                id: 3,
                field: 'third_field',
                label: 'Terceiro Campo'
            }
        ]
    },
    // {
    //   id: 2,
    //   resource: 'companies',
    //   label: 'Empresas',
    //   fields: [
    //     {
    //       id: 1,
    //       field: 'campo_teste',
    //       label: 'Test Field'
    //     },
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
];
