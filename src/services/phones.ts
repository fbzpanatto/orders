import { objectResponse } from '../utils/response';
import { PersonPhones } from '../interfaces/phones';
import { selectAllFromWhere, updateTableSetWhere, insertInto } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { myDbConnection } from './db';

export const getPersonPhones = async (personId: number) => {
  let connection = null;

  try {

    connection = await myDbConnection()
    const result = await selectAllFromWhere(connection, Tables.person_phones, 'person_id', personId) as Array<PersonPhones>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createPhone = async (body: PersonPhones) => {
  let connection = null;

  try {

    connection = await myDbConnection()
    const queryResult = await insertInto(connection, Tables.person_phones, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updatePhone = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.person_phones, 'id', id, req.body as PersonPhones, ['person_id'])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}