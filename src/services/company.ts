import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { Request } from 'express';
import { emptyOrRows } from '../helper';
import { myDbConnection } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';

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

    const queryString =
      `
    SELECT c.*, a.*
    FROM ${Tables.companies} AS c
    LEFT JOIN ${Tables.company_address} AS a ON c.id = a.company_id
    WHERE c.id=?
    `

    const [result] = await connection.query(format(queryString, [companyId]))
    const castResult = (result as Array<any>)[0]

    const formatedResult: Company = {
      company: {
        id: castResult.id,
        active: castResult.active,
        cnpj: castResult.cnpj,
        corporate_name: castResult.corporate_name,
        social_name: castResult.social_name,
        state_registration: castResult.state_registration
      },
      address: {
        company_id: castResult.company_id,
        add_city: castResult.add_city,
        add_neighborhood: castResult.add_neighborhood,
        add_number: castResult.add_number,
        add_street: castResult.add_street,
        add_uf: castResult.add_uf,
        add_zipcode: castResult.add_zipcode
      }
    }

    console.log('formatedResult', formatedResult)

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: formatedResult })
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
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}