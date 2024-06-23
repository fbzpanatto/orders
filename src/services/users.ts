import { objectResponse } from '../utils/response';
import { updateTableSetWhere, insertInto, selectAllFrom, selectMaxColumn } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';
import { Request } from 'express'
import { User } from '../interfaces/users';

const company_id = 'company_id'
const USER_ID = 'user_id'
const COMPANY_ID = 'company_id'
const MAX_USER_ID = 'max_user_id'

export const getUsers = async (request: Request, page: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const queryString = `
    SELECT u.user_id, u.name, u.active, u.username, u.created_at, c.corporate_name, r.role_name
    FROM ${Tables.users} AS u
    LEFT JOIN ${Tables.companies} AS c ON u.${company_id} = c.${company_id}
    LEFT JOIN ${Tables.roles} AS r ON u.${company_id} = r.${USER_ID}
    `

    const rows = await selectAllFrom<User>(connection, Tables.users, page, queryString)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getUserById = async (userId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const queryString = `SELECT * FROM ${Tables.users} AS u WHERE u.user_id=?`

    const [result] = await connection.query(format(queryString, [userId]))
    const data = (result as Array<User>)[0]

    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const createUser = async (body: User) => {

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const newUserId = await selectMaxColumn(conn, Tables.users, USER_ID, MAX_USER_ID, COMPANY_ID, (body.company_id as number))
    const [queryResult] = await insertInto(conn, Tables.users, { ...body, user_id: newUserId }, [])

    const affectedRows = (queryResult as ResultSetHeader).affectedRows

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows });
  }
  catch (error) {
    console.log(error)
    return rollBackCatchBlock(error, conn)
  }
  finally { if (conn) { conn.release() } }
}

export const updateUser = async (request: Request) => {

  const { body, query } = request
  const { user_id, company_id } = query

  let connection = null;

  try {

    connection = await dbConn()

    await connection.beginTransaction()

    const result = await updateTableSetWhere(connection, Tables.users, 'user_id', 1, body, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  console.log('rollBackCatchBlock', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}