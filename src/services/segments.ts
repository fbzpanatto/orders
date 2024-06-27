import { dbConn } from './db';
import { Request } from 'express';
import { Tables } from '../enums/tables';
import { PoolConnection } from 'mysql2/promise';
import { objectResponse } from '../utils/response';
import { insertInto, selectWithJoinsAndWhere, JoinClause, selectMaxColumn, update } from '../utils/queries';
import { emptyOrRows } from '../helper';

export const getSegments = async (req: Request) => {

  const { company_id, segment_id } = req.query

  let conn = null;
  let extra: { [key: string]: any } = {}

  try {

    conn = await dbConn()

    const baseTable = Tables.segments
    const baseAlias = 's'
    const joins: JoinClause[] = [{ table: Tables.companies, alias: 'c', conditions: [{ column1: 's.company_id', column2: 'c.company_id' }] }]

    if (!isNaN(parseInt(company_id as string)) && !isNaN(parseInt(segment_id as string))) {
      const result = await selectWithJoinsAndWhere(conn, baseTable, baseAlias, ['s.*', 'c.cnpj', 'c.social_name'], { company_id, segment_id }, joins)
      const data = (result as Array<{ [key: string]: any }>)[0]
      extra.companies = await selectWithJoinsAndWhere(conn, Tables.companies, 'c', ['c.*'], { company_id })
      return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta: { extra } })
    }

    const wherecondition = !isNaN(parseInt(company_id as string)) ? { company_id: parseInt(company_id as string) } : {}
    const rows = await selectWithJoinsAndWhere(conn, Tables.segments, 's', ['s.*', 'c.corporate_name'], wherecondition, joins)
    const data = emptyOrRows(rows)

    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (conn) { conn.release() } }
}

export const createSegment = async (req: Request) => {

  const { body } = req
  let conn = null;

  try {
    conn = await dbConn()
    await conn.beginTransaction()
    const segment_id = await selectMaxColumn(conn, Tables.segments, 'segment_id', 'max_segment_id', 'company_id', (body.company_id as number))
    await insertInto(conn, Tables.segments, { ...body, segment_id }, [])
    await conn.commit()
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollBackCatchBlock(error, conn) }
  finally { if (conn) { conn.release() } }
}

export const updateSegment = async (req: Request) => {

  const { body, query } = req
  const { company_id, segment_id } = query

  let connection = null;

  try {
    connection = await dbConn()
    await connection.beginTransaction()
    await update(connection, Tables.segments, { segment_id, company_id }, { name: body.name }, [])
    await connection.commit()
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}