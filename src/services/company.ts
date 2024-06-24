import { JoinClause } from './../utils/queries';
import { objectResponse } from '../utils/response';
import { Company } from '../interfaces/company';
import { updateTableSetWhere, insertInto, selectAllFrom, selectWithJoinsAndWhere } from '../utils/queries';
import { Tables } from '../enums/tables';
import { emptyOrRows } from '../helper';
import { dbConn } from './db';
import { PoolConnection } from 'mysql2/promise';
import { format, ResultSetHeader } from 'mysql2';
import { Request } from 'express'
import { CONFIGURABLE_RESOURCES_AND_FIELDS as RESOURCE } from './../enums/resources';
import { Field } from '../interfaces/field';

interface CompanyRole { company_id: number, corporate_name: string, role_id: number, role_name: string }

export const getCompanies = async (page: number, request: Request) => {

  const { custom_fields, roles, company_id } = request.query

  let connection = null;
  let extra = null;

  try {

    const baseTable = 'companies';
    const baseAlias = 'c';

    connection = await dbConn()

    if (roles) {
      const selectFields = ['c.company_id', 'c.corporate_name', 'r.role_id', 'r.role_name']
      const whereConditions = {}
      const joins: JoinClause[] = [{ table: 'roles', alias: 'r', conditions: [{ column1: 'c.company_id', column2: 'r.company_id' }] }]

      const queryResult = await selectWithJoinsAndWhere(connection, baseTable, baseAlias, selectFields, whereConditions, joins) as Array<CompanyRole>
      return objectResponse(200, 'Consulta realizada com sucesso.', { data: companyRoles(queryResult) })
    }

    if (custom_fields && company_id) {
      const baseTable = 'fields';
      const baseAlias = 'f';
      const selectFields = ['f.*']
      const whereConditions = { company_id }
      const joins: JoinClause[] = []

      extra = ((await selectWithJoinsAndWhere(connection, baseTable, baseAlias, selectFields, whereConditions, joins)) as Field[])
        .map((row: Field) => {
          return {
            id: row.field_id,
            table: RESOURCE.find(table => table.id === row.table_id)?.label,
            field: RESOURCE.find(table => table.id === row.table_id)?.fields.find(fl => fl.id === row.field_id)?.field, label: row.label
          }
        })
    }

    const companies = emptyOrRows(await selectAllFrom<Company>(connection, Tables.companies, page));

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: companies, meta: { page, extra } })
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
  if (connection) await connection.rollback()
  return objectResponse(400, 'Não foi possível processar a sua solicitação.')
}

const companyRoles = (arr: CompanyRole[]) => {
  return arr.reduce((acc: { company_id: number, corporate_name: string, roles: { role_id: number, role_name: string }[] }[], curr: CompanyRole) => {
    if (!acc.find(el => el.company_id === curr.company_id)) { acc.push({ company_id: curr.company_id, corporate_name: curr.corporate_name, roles: [] }) }
    acc.find(el => el.company_id === curr.company_id)?.roles.push({ role_id: curr.role_id, role_name: curr.role_name })
    return acc
  }, [])
}