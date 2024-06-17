import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { updateTableSetWhere, insertInto, selectAllFrom, duplicateKeyUpdate } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection, format } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Permission } from '../interfaces/permission';
import { RESOURCES } from './../enums/resources';

const ROLE_ID = 'role_id'
const COMPANY_ID = 'company_id'

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

  console.log('roleId', roleId)

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
    const queryResult = (result as Array<{ role_id: number, role_name: string, created_at: string, updated_at: string, permission_id: number, table_id: number, canCreate: number, canRead: number, canUpdate: number, canDelete: number }>)
    console.log(queryResult)

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: {} })
  }
  catch (error) {
    console.log('error', error)
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (connection) { connection.release() } }
}

export const createPermission = async (body: Permission) => {

  let conn = null;

  try {

    const permissions = Object.keys(body)
      .filter(key => key != 'role')
      .map(key => { return { ...body[key as keyof Permission], table_id: RESOURCES[key as keyof typeof RESOURCES] } })

    conn = await dbConn()
    await conn.beginTransaction()

    const [queryResult] = await insertInto(conn, Tables.roles, { ...body.role }, [])

    const roleId = (queryResult as ResultSetHeader).insertId
    await duplicateKeyUpdate(conn, Tables.permissions, permissions, ROLE_ID, roleId)
    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) { return rollback(error, conn) }
  finally { if (conn) { conn.release() } }
}

export const updatePermission = async (company_id: number, body: Company) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    await Promise.all([
      await updateTableSetWhere(connection, Tables.companies, COMPANY_ID, company_id, body.company, []),
      await updateTableSetWhere(connection, Tables.company_address, 'company_id', company_id, body.address, []),
    ])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollback(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollback = async (error: any, connection: PoolConnection | null) => {
  console.log('error', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}