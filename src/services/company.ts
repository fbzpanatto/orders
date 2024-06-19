import { RESOURCES_NAME_TO_ID } from './../enums/resources';
import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { updateTableSetWhere, insertInto, selectAllFrom, selectAllFromWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';
import { Request } from 'express'
import { CONFIGURABLE_RESOURCES_AND_FIELDS as RESOURCE } from './../enums/resources';
import { Field } from '../interfaces/field';

export const getCompanies = async (page: number, request: Request) => {

  const { customFields } = request.query

  let connection = null;
  let extra = null;

  try {

    connection = await dbConn()

    const data = emptyOrRows(await selectAllFrom<Company>(connection, Tables.companies, page));

    if (customFields) {

      extra = (await selectAllFromWhere(connection, Tables.fields, 'table_id', RESOURCES_NAME_TO_ID.customers) as Field[])
        .map(row => {
          return {
            id: row.id,
            table: RESOURCE.find(table => table.id === row.table_id)?.label,
            field: RESOURCE.find(table => table.id === row.table_id)?.fields.find(fl => fl.id === row.field_id)?.field, label: row.label
          }
        })
    }

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta: { page, extra } })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getCompanyById = async (companyId: number) => {

  let connection = null;

  try {

    connection = await dbConn()
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

export const createCompany = async (body: Company) => {

  let connection = null;

  try {

    connection = await dbConn()
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

export const updateCompany = async (company_id: number, body: Company) => {

  let connection = null;

  try {

    connection = await dbConn()
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
  console.log('rollBackCatchBlock', error)
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}