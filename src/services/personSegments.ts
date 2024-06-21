import { objectResponse } from '../utils/response';
import { selectAllWithWhere, updateTableSetWhere, insertInto } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { PersonSegments } from '../interfaces/personSegments';
import { dbConn } from './db';

export const getPersonSegments = async (req: Request) => {

  const { person_id } = req.query

  let connection = null;

  try {

    connection = await dbConn()
    const result = await selectAllWithWhere(connection, Tables.person_segments, { person_id }) as Array<PersonSegments>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createPersonSegment = async (body: PersonSegments) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await insertInto(connection, Tables.person_segments, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updatePersonSegment = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.person_segments, 'id', id, req.body as PersonSegments, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}