import { objectResponse } from '../utils/response';
import { selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { myDbConnection } from './db';

export const getRoles = async (page: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const rows = await selectAllFrom(connection, Tables.roles, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}