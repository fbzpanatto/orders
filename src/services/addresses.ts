import { objectResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';
import { findRegistersByOneParameter, updateRow, createRow } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getPersonAddresses = async (personId: number) => {
  try {
    const result = await findRegistersByOneParameter(DatabaseTables.person_addresses, 'person_id', personId) as Array<PersonAddresses>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createAddress = async (body: PersonAddresses) => {
  try {
    const queryResult = await createRow(DatabaseTables.person_addresses, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateAdress = async (id: number, req: Request) => {
  try {
    const queryResult = await updateRow(DatabaseTables.person_addresses, 'id', id, req.body as PersonAddresses, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}