import { objectResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';
import { selectAllFromWhere, updateTableSetWhere, insertInto } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { myDbConnection } from './db';

export const getPersonAddresses = async (personId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const result = await selectAllFromWhere(connection, Tables.person_addresses, 'person_id', personId) as Array<PersonAddresses>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createAddress = async (body: PersonAddresses) => {
  let connection = null;

  try {

    connection = await myDbConnection()
    const queryResult = await insertInto(connection, Tables.person_addresses, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateAdress = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.person_addresses, 'id', id, req.body as PersonAddresses, ['person_id'])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}