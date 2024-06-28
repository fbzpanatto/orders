import { objectResponse } from '../utils/response';
import { insertInto, update, selectJoinsWhere, JoinClause, WhereConditions } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Field } from '../interfaces/field';
import { Request } from 'express'
import { CONFIGURABLE_RESOURCES_AND_FIELDS as RESOURCE } from '../enums/resources';
import { getCustomFields, getSegments } from './customers';

export const getFields = async (request: Request, page: number) => {

  const { company_id, table_id, field_id, custom_fields, segments } = request.query

  let conn = null;
  let extra: { [key: string]: any } = {}

  try {

    conn = await dbConn()

    const baseTable = Tables.fields;
    const baseAlias = 'f';

    if (!isNaN(parseInt(company_id as string)) && table_id && field_id) {

      const selectFields = ['f.*'];
      const whereConditions: WhereConditions = { company_id, table_id, field_id };
      const joins: JoinClause[] = [{ table: Tables.companies, alias: 'c', conditions: [{ column1: 'f.company_id', column2: 'c.company_id' }] }]

      const result = await selectJoinsWhere(conn, baseTable, baseAlias, selectFields, whereConditions, joins)
      const data = (result as Array<{ [key: string]: any }>)[0]
      return objectResponse(200, 'Consulta realizada com sucesso.', { data })
    }

    if (!isNaN(parseInt(company_id as string)) && custom_fields && segments) {
      extra.custom_fields = await getCustomFields(conn, parseInt(company_id as string))
      extra.segments = await getSegments(conn, parseInt(company_id as string))
      return objectResponse(200, 'Consulta realizada com sucesso.', { data: [], meta: { extra, page } })
    }

    const selectFields = ['f.*', 'c.corporate_name'];
    const whereConditions: WhereConditions = company_id ? { company_id } : {};
    const joins: JoinClause[] = [{ table: Tables.companies, alias: 'c', conditions: [{ column1: 'f.company_id', column2: 'c.company_id' }] }]

    const rows = await selectJoinsWhere(conn, baseTable, baseAlias, selectFields, whereConditions, joins)
    const data = formatedData(emptyOrRows(rows));

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta: { extra, page } })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (conn) { conn.release() } }
}

export const createField = async (body: Field) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const [queryResult] = await insertInto(connection, Tables.fields, body, [])

    const affectedRows = (queryResult as ResultSetHeader).affectedRows

    await connection.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

export const updateField = async (request: Request) => {

  let connection = null;
  const { body, query } = request
  const { table_id, field_id, company_id } = query

  try {

    connection = await dbConn()

    await connection.beginTransaction()
    const result = await update(connection, Tables.fields, { table_id, field_id, company_id }, { label: body.label }, [])

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

const formatedData = (data: any[]) => {
  return data.map(row => {
    return {
      table_id: row.table_id,
      field_id: row.field_id,
      company_id: row.company_id,
      corporate_name: row.corporate_name,
      table: RESOURCE.find(table => table.id === row.table_id)?.label,
      field: RESOURCE.find(table => table.id === row.table_id)?.fields.find(fl => fl.id === row.field_id)?.label,
      label: row.label
    }
  })
}