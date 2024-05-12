import { objectResponse } from '../utils/response';
import { Segments } from '../interfaces/segments';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getSegments = async (page: number) => {
  try {
    const rows = await selectAllFrom<Segments>(DatabaseTables.segments, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getSegment = async (segmentId: number) => {
  try {
    const result = await selectAllFromWhere(DatabaseTables.segments, 'id', segmentId) as Array<Segments>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createSegment = async (body: Segments) => {
  try {
    const queryResult = await insertInto(DatabaseTables.segments, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateSegment = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.segments, 'id', id, req.body as Segments, [])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}