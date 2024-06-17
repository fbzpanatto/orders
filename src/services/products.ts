import { objectResponse } from '../utils/response';
import { Products } from '../interfaces/products';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';

export const getProducts = async (page: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const rows = await selectAllFrom<Products>(connection, Tables.products, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getProduct = async (statusId: number) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await selectAllFromWhere(connection, Tables.products, 'id', statusId) as Array<Products>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createProduct = async (body: Products) => {
  let connection = null;

  try {

    connection = await dbConn()
    const queryResult = await insertInto(connection, Tables.products, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateProduct = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.products, 'id', id, req.body as Products, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}