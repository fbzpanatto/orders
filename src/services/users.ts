import { objectResponse } from '../utils/response';
import { insertInto, selectMaxColumn, selectJoinsWhere, update, JoinClause } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Request } from 'express'
import { User } from '../interfaces/users';

interface CompanyRole { company_id: number, corporate_name: string, role_id: number, role_name: string }

interface UserToUpdate { role_id: number, company_id: number, name: string, active: boolean, username: string, password: string }
interface AllUsers { user_id: number, name: string, active: boolean | number, username: string, corporate_name: string, role_name: string, created_at: string, company_id: number }

const USER_ID = 'user_id'
const COMPANY_ID = 'company_id'
const MAX_USER_ID = 'max_user_id'

export const getUsers = async (request: Request, page: number) => {

  const { company_id, user_id, roles } = request.query

  let conn = null;
  let companyRoles = null;

  const baseTable = 'users';
  const baseAlias = 'u';
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

  try {

    conn = await dbConn()

    if (roles) {
      const selectFields = ['c.company_id', 'c.corporate_name', 'r.role_id', 'r.role_name']
      const whereConditions = {}
      const joins: JoinClause[] = [{ table: 'roles', alias: 'r', conditions: [{ column1: 'c.company_id', column2: 'r.company_id' }] }]

      const queryResult = await selectJoinsWhere(conn, Tables.companies, 'c', selectFields, whereConditions, joins) as Array<CompanyRole>
      companyRoles = companyRolesFn(queryResult)
    }

    if (company_id && user_id) {

      const selectFields = ['u.user_id', 'u.name', 'u.username', 'u.password', 'u.active', 'r.role_id', 'c.company_id']
      const whereConditions = { company_id, user_id }
      const result = (await selectJoinsWhere(conn, baseTable, baseAlias, selectFields, whereConditions, joins) as Array<{ [key: string]: any }>)[0]

      return objectResponse(200, 'Consulta realizada com sucesso.', { data: result, meta: { companyRoles } })
    }

    const selectFields = ['u.user_id', 'u.name', 'u.username', 'u.active', 'u.created_at', 'r.role_id, r.role_name', 'c.company_id', 'c.corporate_name']
    const whereConditions = {}

    const result = await selectJoinsWhere(conn, baseTable, baseAlias, selectFields, whereConditions, joins)

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

    const newUserId = await selectMaxColumn(conn, Tables.users, USER_ID, MAX_USER_ID, COMPANY_ID, (body.company_id as number))
    const [queryResult] = await insertInto(conn, Tables.users, { ...body, user_id: newUserId }, [])
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

  let conn = null;

  try {

    conn = await dbConn()

    await conn.beginTransaction()

    const result = await update(conn, Tables.users, { user_id, company_id }, (body as UserToUpdate), [])

    await conn.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, conn) }
  finally { if (conn) { conn.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  console.log(error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}

const companyRolesFn = (arr: CompanyRole[]) => {
  return arr.reduce((acc: { company_id: number, corporate_name: string, roles: { role_id: number, role_name: string }[] }[], curr: CompanyRole) => {
    if (!acc.find(el => el.company_id === curr.company_id)) { acc.push({ company_id: curr.company_id, corporate_name: curr.corporate_name, roles: [] }) }
    acc.find(el => el.company_id === curr.company_id)?.roles.push({ role_id: curr.role_id, role_name: curr.role_name })
    return acc
  }, [])
}