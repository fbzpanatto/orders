import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { updateTableSetWhere, insertInto, selectAllFrom } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { myDbConnection } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';

export const getPermissions = async (page: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const rows = await selectAllFrom(connection, Tables.permissions, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getPermissionByRole = async (companyId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    const company_id = 'company_id'

    const queryString =
      `
    SELECT c.*, a.*
    FROM ${Tables.companies} AS c
    LEFT JOIN ${Tables.company_address} AS a ON c.${company_id} = a.${company_id}
    WHERE c.${company_id}=?
    `

    const [result] = await connection.query(format(queryString, [companyId]))
    const castResult = (result as Array<any>)[0]

    const formatedResult: Company = {
      company: {
        company_id: castResult.company_id,
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

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: formatedResult })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const createPermission = async (body: Company) => {

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

export const updatePermission = async (company_id: number, body: Company) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    await Promise.all([
      await updateTableSetWhere(connection, Tables.companies, 'company_id', company_id, body.company, []),
      await updateTableSetWhere(connection, Tables.company_address, 'company_id', company_id, body.address, []),
    ])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) { return rollBackCatchBlock(error, connection) }
  finally { if (connection) { connection.release() } }
}

const rollBackCatchBlock = async (error: any, connection: PoolConnection | null) => {
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}