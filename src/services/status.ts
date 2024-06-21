import { objectResponse } from '../utils/response';
import { Status } from '../interfaces/status';
import { selectAllWithWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';

export const getStatus = async (page: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const rows = await selectAllFrom<Status>(connection, Tables.status, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOneStatus = async (req: Request) => {
  let connection = null;

  try {

    connection = await dbConn()
    const result = await selectAllWithWhere(connection, Tables.status, {}) as Array<Status>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createStatus = async (body: Status) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await insertInto(connection, Tables.status, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateStatus = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.status, 'id', id, req.body as Status, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}