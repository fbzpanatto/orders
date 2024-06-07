import { objectResponse } from '../utils/response';
import { Status } from '../interfaces/status';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getStatus = async (page: number) => {
  try {
    const rows = await selectAllFrom<Status>(Tables.status, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOneStatus = async (statusId: number) => {
  try {
    const result = await selectAllFromWhere(Tables.status, 'id', statusId) as Array<Status>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createStatus = async (body: Status) => {
  try {
    const queryResult = await insertInto(Tables.status, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateStatus = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(Tables.status, 'id', id, req.body as Status, [])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}