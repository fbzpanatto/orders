import { objectResponse } from '../utils/response';
import { updateTableSetWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';
import { User } from '../interfaces/users';

export const updateUser = async (userId: number, body: User) => {

  let connection = null;

  try {

    connection = await dbConn()

    await connection.beginTransaction()

    const result = await updateTableSetWhere(connection, Tables.users, 'user_id', userId, body, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  console.log('rollBackCatchBlock', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}