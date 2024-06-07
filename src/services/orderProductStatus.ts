import { objectResponse } from '../utils/response';
import { OrderProductsStatus } from '../interfaces/order_products_status';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getAllOrderProductsStatus = async (page: number) => {
  try {
    const rows = await selectAllFrom<OrderProductsStatus>(Tables.order_products_status, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOrderProductsStatus = async (orderId: number) => {
  try {
    const queryResult = await selectAllFromWhere(Tables.order_products_status, 'order_id', orderId) as Array<OrderProductsStatus>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createOrderProductsStatus = async (body: OrderProductsStatus) => {
  try {
    const queryResult = await insertInto(Tables.order_products_status, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateOrderProductsStatus = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(Tables.order_products_status, 'id', id, req.body as OrderProductsStatus, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}