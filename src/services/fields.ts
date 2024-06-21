import { objectResponse } from '../utils/response';
import { insertInto, update, selectAllWithWhereLeft } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';
import { Field } from '../interfaces/field';
import { Request } from 'express'
import { CONFIGURABLE_RESOURCES_AND_FIELDS as RESOURCE } from '../enums/resources';

export const getFields = async (request: Request, page: number) => {

  const { company_id, table_id, field_id } = request.query

  let connection = null;

  try {

    connection = await dbConn()

    const leftJoins = [{ table: Tables.companies, on: `${Tables.fields}.company_id = ${Tables.companies}.company_id` }]

    if (company_id && table_id && field_id) {
      const result = await selectAllWithWhereLeft(connection, Tables.fields, { company_id, table_id, field_id }, leftJoins)
      const data = (result as Array<any>)[0]
      return objectResponse(200, 'Consulta realizada com sucesso.', { data })
    }

    const rows = await selectAllWithWhereLeft(connection, Tables.fields, {}, leftJoins)
    const data = emptyOrRows(rows);
    const meta = { page };

    const formatedData = (data as any[]).map(row => {
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
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: formatedData, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
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