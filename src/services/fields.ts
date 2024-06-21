import { objectResponse } from '../utils/response';
import { insertInto, update, selectAllWithWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';
import { Field } from '../interfaces/field';
import { Request } from 'express'
import { CONFIGURABLE_RESOURCES_AND_FIELDS as RESOURCE } from '../enums/resources';

export const getFields = async (request: Request, page: number) => {

  const { query } = request
  const { company_id } = query

  let connection = null;

  try {

    connection = await dbConn()

    const rows = await selectAllWithWhere(connection, Tables.fields, { company_id })
    const data = emptyOrRows(rows);
    const meta = { page };

    const formatedData = (data as Field[]).map(row => {
      return {
        id: row.id,
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

export const getFieldById = async (fieldId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const queryString = `SELECT * FROM ${Tables.fields} AS f WHERE f.id=?`

    const [result] = await connection.query(format(queryString, [fieldId]))
    const data = (result as Array<any>)[0]

    return objectResponse(200, 'Consulta realizada com sucesso.', { data })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
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