import { objectResponse } from '../utils/response';
import { selectAllFromWhere, updateTableSetWhere, insertInto } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';
import { PersonSegments } from '../interfaces/personSegments';

export const getPersonSegments = async (personId: number) => {
  try {
    const result = await selectAllFromWhere(DatabaseTables.person_segments, 'person_id', personId) as Array<PersonSegments>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createPersonSegment = async (body: PersonSegments) => {
  try {
    const queryResult = await insertInto(DatabaseTables.person_segments, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updatePersonSegment = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.person_segments, 'id', id, req.body as PersonSegments, [])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}