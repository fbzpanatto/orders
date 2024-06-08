import { objectResponse } from '../utils/response';
import { Segments } from '../interfaces/segments';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { myDbConnection } from './db';

export const getSegments = async (page: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    const rows = await selectAllFrom<Segments>(connection, Tables.segments, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getSegment = async (segmentId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    const result = await selectAllFromWhere(connection, Tables.segments, 'id', segmentId) as Array<Segments>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createSegment = async (body: Segments) => {
  let connection = null;

  try {

    connection = await myDbConnection()
    const queryResult = await insertInto(connection, Tables.segments, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateSegment = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.segments, 'id', id, req.body as Segments, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}