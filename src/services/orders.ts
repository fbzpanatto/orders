import { objectResponse } from '../utils/response';
import { Orders } from '../interfaces/orders';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getAllOrders = async (page: number) => {
  try {
    const rows = await selectAllFrom<Orders>(DatabaseTables.orders, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getPersonOrders = async (personId: number) => {
  try {
    const queryResult = await selectAllFromWhere(DatabaseTables.orders, 'person_id', personId) as Array<Orders>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOrder = async (orderId: number) => {
  try {
    const queryResult = await selectAllFromWhere(DatabaseTables.orders, 'id', orderId) as Array<Orders>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createOrder = async (body: Orders) => {
  try {
    const queryResult = await insertInto(DatabaseTables.orders, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateOrder = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.orders, 'id', id, req.body as Orders, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}