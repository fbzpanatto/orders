import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { selectAllFromWhere, updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { myDbConnection } from './db';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

export const getCompanies = async (page: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const rows = await selectAllFrom<Company>(connection, Tables.companies, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getCompanyById = async (companyId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    const queryResult = await selectAllFromWhere(connection, Tables.companies, 'id', companyId) as Array<Company>
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: queryResult })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const createCompany = async (body: Company) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const [queryResult] = await insertInto(connection, Tables.companies, { ...body.company }, [])

    const companyId = (queryResult as ResultSetHeader).insertId

    console.log('--------------- companyId', (queryResult as ResultSetHeader).insertId)

    await insertInto(connection, Tables.company_address, { ...body.address, company_id: companyId }, [])

    await connection.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 2 });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

export const updateCompany = async (id: number, req: Request) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const queryResult = await updateTableSetWhere(connection, Tables.companies, 'id', id, req.body as Company, [])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  console.log('------------- error', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}