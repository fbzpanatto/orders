import { objectResponse } from '../utils/response';
import { insertInto, selectAllFrom, duplicateKeyUpdate, selectMaxColumn, update, duplicateKey, selectAllWithWhere, selectAllWithWhereLeft } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection, format } from 'mysql2/promise';
import { Permission } from '../interfaces/permission';
import { Request } from 'express'
import { RESOURCES_ID_TO_NAME, RESOURCES_NAME_TO_ID } from './../enums/resources';

const ROLE_ID = 'role_id'
const COMPANY_ID = 'company_id'
const MAX_ROLE_ID = 'max_role_id'
const PERMISSION_ID = 'permission_id'
const MAX_PERMISSION_ID = 'max_permission_id'
interface RolePermissions {
  role_id: number,
  role_name: string,
  created_at: string,
  updated_at: string,
  permission_id: number,
  table_id: number,
  canCreate: number,
  canRead: number,
  canUpdate: number,
  canDelete: number,
  company_id: number
}

export const getRoles = async (request: Request, page: number) => {

  let connection = null;

  const { role_id, company_id } = request.query

  try {

    connection = await dbConn()

    const leftJoins = [{ table: Tables.companies, on: `${Tables.roles}.company_id = ${Tables.companies}.company_id` }]

    if (role_id && company_id) {

      const queryString = `
      SELECT r.*, p.*, c.company_id
      FROM ${Tables.roles} AS r
      LEFT JOIN ${Tables.permissions} AS p 
        ON r.${ROLE_ID} = p.${ROLE_ID} AND r.${COMPANY_ID} = p.${COMPANY_ID}
      LEFT JOIN ${Tables.companies} AS c 
        ON r.${COMPANY_ID} = c.${COMPANY_ID}
      WHERE r.${ROLE_ID} = ? AND r.${COMPANY_ID} = ?
    `

      const [result] = await connection.query(format(queryString, [parseInt(role_id as string), parseInt(company_id as string)]))
      const queryResult = (result as Array<RolePermissions>)

      const data = queryResult.reduce((acc: any, curr: RolePermissions) => {
        if (!acc.role) { acc = { role: { role_id: curr.role_id, role_name: curr.role_name, company_id: curr.company_id } } }
        const resource = RESOURCES_ID_TO_NAME[curr.table_id as keyof typeof RESOURCES_ID_TO_NAME]
        if (!acc[resource]) {
          acc[resource] = {
            permission_id: curr.permission_id,
            role_id: curr.role_id,
            company_id: curr.company_id,
            canCreate: curr.canCreate,
            canRead: curr.canRead,
            canUpdate: curr.canUpdate,
          }
        }
        return acc;
      }, {})
      return objectResponse(200, 'Consulta realizada com sucesso.', { data })
    }

    const rows = await selectAllWithWhereLeft(connection, Tables.roles, { company_id: 1 }, leftJoins)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) {
    console.log('getRoles Error', error)
    return objectResponse(400, 'Não foi possível processar sua solicitação.', {})
  }
  finally { if (connection) { connection.release() } }
}

export const createPermission = async (body: Permission) => {

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const newRoleId = await selectMaxColumn(conn, Tables.roles, ROLE_ID, MAX_ROLE_ID, COMPANY_ID, (body.company?.company_id as number))

    await insertInto(conn, Tables.roles, { ...body.role, role_id: newRoleId, company_id: body.company?.company_id }, [])

    const startingPermissionId = await selectMaxColumn(conn, Tables.permissions, PERMISSION_ID, MAX_PERMISSION_ID, COMPANY_ID, (body.company?.company_id as number))
    const permissionsBody = createPermissions(body, (body.company?.company_id as number), newRoleId, startingPermissionId)

    await duplicateKeyUpdate(conn, Tables.permissions, permissionsBody, ROLE_ID, newRoleId)
    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) {
    console.log('createPermission', error)
    return rollback(error, conn)
  }
  finally { if (conn) { conn.release() } }
}

export const updatePermission = async (request: Request) => {

  const { body, query } = request
  const { role_id, company_id } = query

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    await Promise.all([
      await update(conn, Tables.roles, { role_id, company_id }, body.role, []),
      await duplicateKey(conn, Tables.permissions, formatPermissions(body))
    ])

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) { return rollback(error, conn) }
  finally { if (conn) { conn.release() } }
}

const createPermissions = (body: Permission, companyId: number, roleId: number, counterId: number) => {

  return Object.keys(body)
    .filter(key => key != 'role' && key != 'company')
    .map((key, index) => {
      if (index != 0) { counterId += 1 }
      return { ...body[key as keyof Permission], table_id: RESOURCES_NAME_TO_ID[key as keyof typeof RESOURCES_NAME_TO_ID], company_id: companyId, permission_id: counterId, role_id: roleId };
    })
}

const formatPermissions = (body: Permission) => {
  return Object.keys(body)
    .filter(key => key != 'role' && key != 'company')
    .map((key) => { return { ...body[key as keyof Permission], table_id: RESOURCES_NAME_TO_ID[key as keyof typeof RESOURCES_NAME_TO_ID] } })
}

const rollback = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}