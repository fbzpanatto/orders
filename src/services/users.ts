import { objectResponse } from '../utils/response';
import { updateTableSetWhere, insertInto, selectMaxColumn, selectWithJoinsAndWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Request } from 'express'
import { User } from '../interfaces/users';

interface AllUsers { user_id: number, name: string, active: boolean | number, username: string, corporate_name: string, role_name: string, created_at: string, company_id: number }

const USER_ID = 'user_id'
const COMPANY_ID = 'company_id'
const MAX_USER_ID = 'max_user_id'

export const getUsers = async (request: Request, page: number) => {

  const { company_id, user_id } = request.query

  let conn = null;

  const baseTable = 'users';
  const baseAlias = 'u';

  try {

    conn = await dbConn()

    if (company_id && user_id) {
      console.log('pegando um item')
    }

    const selectFields = [
      'u.user_id', 'u.name', 'u.username', 'u.active', 'u.created_at', 'r.role_id, r.role_name', 'c.company_id', 'c.corporate_name'
    ];
    const whereConditions = {}
    const joins = [
      {
        table: 'roles',
        alias: 'r',
        conditions: [
          { column1: 'u.company_id', column2: 'r.company_id' },
          { column1: 'u.role_id', column2: 'r.role_id' }
        ]
      },
      {
        table: 'companies',
        alias: 'c',
        conditions: [
          { column1: 'c.company_id', column2: 'r.company_id' }
        ]
      }
    ]

    const result = await selectWithJoinsAndWhere(
      conn, baseTable, baseAlias, selectFields, whereConditions, joins
    )

    const data = emptyOrRows(result) as Array<AllUsers>
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (conn) { conn.release() } }
}

export const createUser = async (body: User) => {

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const newUserId = await selectMaxColumn(
      conn, Tables.users, USER_ID, MAX_USER_ID, COMPANY_ID, (body.company_id as number)
    )

    const [queryResult] = await insertInto(
      conn, Tables.users, { ...body, user_id: newUserId }, []
    )

    const affectedRows = (queryResult as ResultSetHeader).affectedRows

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, conn) }
  finally { if (conn) { conn.release() } }
}

export const updateUser = async (request: Request) => {

  const { body, query } = request
  const { user_id, company_id } = query

  let connection = null;

  try {

    connection = await dbConn()

    await connection.beginTransaction()

    const result = await updateTableSetWhere(connection, Tables.users, USER_ID, 1, body, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}