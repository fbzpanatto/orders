import { objectResponse } from '../utils/response';
import { insertInto, selectAllFrom, duplicateKeyUpdate, updateTableSetWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection, format } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Permission } from '../interfaces/permission';
import { RESOURCES_ID_TO_NAME, RESOURCES_NAME_TO_ID } from './../enums/resources';

const ROLE_ID = 'role_id'
interface RolePermissions { role_id: number, role_name: string, created_at: string, updated_at: string, permission_id: number, table_id: number, canCreate: number, canRead: number, canUpdate: number, canDelete: number }

export const getRoles = async (page: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const rows = await selectAllFrom(connection, Tables.roles, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getPermissionByRole = async (roleId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const queryString = `
    SELECT r.*, p.*
    FROM ${Tables.roles} AS r
    LEFT JOIN ${Tables.permissions} AS p ON r.${ROLE_ID} = p.${ROLE_ID}
    WHERE r.${ROLE_ID}=?
    `

    const [result] = await connection.query(format(queryString, [roleId]))
    const queryResult = (result as Array<RolePermissions>)

    const data = queryResult.reduce((acc: any, curr: RolePermissions) => {
      if (!acc.role) { acc = { role: { role_id: curr.role_id, role_name: curr.role_name } } }
      const resource = RESOURCES_ID_TO_NAME[curr.table_id as keyof typeof RESOURCES_ID_TO_NAME]
      if (!acc[resource]) {
        acc[resource] = {
          permission_id: curr.permission_id,
          role_id: curr.role_id,
          canCreate: curr.canCreate,
          canRead: curr.canRead,
          canUpdate: curr.canUpdate
        }
      }
      return acc;
    }, {})

    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const createPermission = async (body: Permission) => {

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const [queryResult] = await insertInto(conn, Tables.roles, { ...body.role }, [])
    const roleId = (queryResult as ResultSetHeader).insertId

    await duplicateKeyUpdate(conn, Tables.permissions, permissions(body), ROLE_ID, roleId)
    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) { return rollback(error, conn) }
  finally { if (conn) { conn.release() } }
}

export const updatePermission = async (roleId: number, body: Permission) => {

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    await Promise.all([
      await updateTableSetWhere(conn, Tables.roles, ROLE_ID, roleId, body.role, []),
      await duplicateKeyUpdate(conn, Tables.permissions, permissions(body), ROLE_ID, roleId)
    ])

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) { return rollback(error, conn) }
  finally { if (conn) { conn.release() } }
}

const permissions = (body: Permission) => {
  return Object.keys(body)
    .filter(key => key != 'role')
    .map(key => { return { ...body[key as keyof Permission], table_id: RESOURCES_NAME_TO_ID[key as keyof typeof RESOURCES_NAME_TO_ID] } })
}

const rollback = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}