import { objectResponse } from '../utils/response';
import { Products } from '../interfaces/products';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';

export const getProducts = async (page: number) => {
  try {
    const rows = await selectAllFrom<Products>(DatabaseTables.products, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getProduct = async (statusId: number) => {
  try {
    const result = await selectAllFromWhere(DatabaseTables.products, 'id', statusId) as Array<Products>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createProduct = async (body: Products) => {
  try {
    const queryResult = await insertInto(DatabaseTables.products, body, [])
    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateProduct = async (id: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.products, 'id', id, req.body as Products, [])
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}