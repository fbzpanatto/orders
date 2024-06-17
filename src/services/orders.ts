import { objectResponse } from '../utils/response';
import { Orders } from '../interfaces/orders';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';

export const getAllOrders = async (page: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const rows = await selectAllFrom<Orders>(connection, Tables.orders, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getPersonOrders = async (personId: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await selectAllFromWhere(connection, Tables.orders, 'person_id', personId) as Array<Orders>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getOrder = async (orderId: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await selectAllFromWhere(connection, Tables.orders, 'id', orderId) as Array<Orders>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createOrder = async (body: Orders) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await insertInto(connection, Tables.orders, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateOrder = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.orders, 'id', id, req.body as Orders, ['person_id'])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}