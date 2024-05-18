import { objectResponse } from '../utils/response';
import { OrderProductsStatus } from '../interfaces/order_products_status';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getAllOrderProductStatus = async (page: number) => {
  try {
    const rows = await selectAllFrom<OrderProductsStatus>(DatabaseTables.order_products_status, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOrderProductStatus = async (orderId: number) => {
  try {
    const queryResult = await selectAllFromWhere(DatabaseTables.order_products_status, 'order_id', orderId) as Array<OrderProductsStatus>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createOrderProductStatus = async (body: OrderProductsStatus) => {
  try {
    const queryResult = await insertInto(DatabaseTables.order_products_status, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateOrderProductStatus = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.order_products_status, 'id', id, req.body as OrderProductsStatus, ['person_id'])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}