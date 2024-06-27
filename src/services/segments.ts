import { dbConn } from './db';
import { Request } from 'express';
import { Tables } from '../enums/tables';
import { PoolConnection } from 'mysql2/promise';
import { Segments } from '../interfaces/segments';
import { objectResponse } from '../utils/response';
import { updateTableSetWhere, insertInto, selectWithJoinsAndWhere, JoinClause } from '../utils/queries';

interface Segment { cnpj: string, company_id: number, corporate_name?: string, social_name?: string, created_at: string, name: string, segment_id: number, updated_at: string }

export const getSegments = async (req: Request) => {

  const { company_id, segment_id } = req.query

  let conn = null;
  let data = null;
  let extra: { [key: string]: any } = {}

  try {

    conn = await dbConn()

    const baseTable = Tables.segments
    const baseAlias = 's'
    const selectFields = ['s.*', 'c.cnpj', 'c.corporate_name']
    const joins: JoinClause[] = [{ table: Tables.companies, alias: 'c', conditions: [{ column1: 's.company_id', column2: 'c.company_id' }] }]

    if (!isNaN(parseInt(company_id as string)) && !isNaN(parseInt(segment_id as string))) {
      const selectFields = ['s.*', 'c.cnpj', 'c.social_name']
      const response = (await selectWithJoinsAndWhere(conn, baseTable, baseAlias, selectFields, { company_id, segment_id }, joins) as Array<any>)[0]
      extra.companies = await selectWithJoinsAndWhere(conn, Tables.companies, 'c', ['c.*'], { company_id })
      return objectResponse(200, 'Consulta realizada com sucesso.', { data: response, meta: { extra } })
    }

    const whereconditions = !isNaN(parseInt(company_id as string)) ? { company_id } : {}

    data = await selectWithJoinsAndWhere(conn, baseTable, baseAlias, selectFields, whereconditions, joins)
    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createSegment = async (req: Request) => {

  const { body } = req

  let connection = null;

  try {
    connection = await dbConn()
    const queryResult = await insertInto(connection, Tables.segments, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateSegment = async (req: Request) => {

  const { body, query } = req
  const { id } = query

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.segments, 'id', parseInt(id as string), req.body as Segments, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}