import { dbConn } from './db';
import { Request } from 'express';
import { Tables } from '../enums/tables';
import { PoolConnection } from 'mysql2/promise';
import { objectResponse } from '../utils/response';
import { insertInto, selectJoinsWhere, JoinClause, selectMaxColumn, update } from '../utils/queries';
import { emptyOrRows } from '../helper';

export const getStatus = async (req: Request) => {

  const { company_id, status_id } = req.query

  let conn = null;
  let extra: { [key: string]: any } = {}

  console.log('entrando aqui --------------------------------------------------------', company_id, status_id)

  try {

    conn = await dbConn()

    const baseTable = Tables.status
    const baseAlias = 's'
    const joins: JoinClause[] = [
        { table: Tables.companies, alias: 'c', conditions: [{ column1: 's.company_id', column2: 'c.company_id' }] }
    ]

    if (!isNaN(parseInt(company_id as string)) && !isNaN(parseInt(status_id as string))) {
      const fields = ['s.*', 'c.cnpj', 'c.social_name']
      const where = { company_id, status_id }

      const result = await selectJoinsWhere(conn, baseTable, baseAlias, fields, where , joins)
      const data = (result as Array<{ [key: string]: any }>)[0]

      extra.companies = await selectJoinsWhere(conn, Tables.companies, 'c', ['c.*'], { company_id })

      return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta: { extra } })
    }

    const fields = ['s.*', 'c.corporate_name']
    const wherecondition = !isNaN(parseInt(company_id as string)) ? { company_id: parseInt(company_id as string) } : {}
    const result = await selectJoinsWhere(conn, Tables.status, 's', fields, wherecondition, joins)

    const data = emptyOrRows(result)

    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (conn) { conn.release() } }
}

export const createStatus = async (req: Request) => {

  const { body } = req
  let conn = null;

  try {
    conn = await dbConn()
    await conn.beginTransaction()
    const status_id = await selectMaxColumn(conn, Tables.status, 'status_id', 'max_status_id', 'company_id', (body.company_id as number))
    await insertInto(conn, Tables.status, { ...body, status_id }, [])
    await conn.commit()
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollBackCatchBlock(error, conn) }
  finally { if (conn) { conn.release() } }
}

export const updateStatus = async (req: Request) => {

  const { body, query } = req
  const { company_id, status_id } = query

  let connection = null;

  try {
    connection = await dbConn()
    await connection.beginTransaction()
    await update(connection, Tables.status, { status_id, company_id }, { name: body.name }, [])
    await connection.commit()
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  console.log('error', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}