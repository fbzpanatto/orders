import { objectResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';
import { selectAllFromWhere, updateTableSetWhere, insertInto } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getPersonAddresses = async (personId: number) => {
  try {
    const result = await selectAllFromWhere(DatabaseTables.person_addresses, 'person_id', personId) as Array<PersonAddresses>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createAddress = async (body: PersonAddresses) => {
  try {
    const queryResult = await insertInto(DatabaseTables.person_addresses, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateAdress = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.person_addresses, 'id', id, req.body as PersonAddresses, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}