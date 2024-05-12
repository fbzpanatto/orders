import { objectResponse } from '../utils/response';
import { PersonPhones } from '../interfaces/phones';
import { selectAllFromWhere, updateRow, createRow } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getPersonPhones = async (personId: number) => {
  try {
    const result = await selectAllFromWhere(DatabaseTables.person_phones, 'person_id', personId) as Array<PersonPhones>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createPhone = async (body: PersonPhones) => {
  try {
    const queryResult = await createRow(DatabaseTables.person_phones, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updatePhone = async (id: number, req: Request) => {
  try {
    const queryResult = await updateRow(DatabaseTables.person_phones, 'id', id, req.body as PersonPhones, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}