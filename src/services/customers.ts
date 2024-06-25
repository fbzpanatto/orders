import { format } from 'mysql2';
import { dbConn } from './db'
import { emptyOrRows } from '../helper'
import { objectResponse } from '../utils/response';
import { Tables } from '../enums/tables'
import { deleteFromWhere, insertInto, selectAllFrom, updateTableSetWhere, selectMaxColumn, duplicateKey, selectWithJoinsAndWhere, JoinClause, update } from '../utils/queries';
import { PoolConnection, QueryResult } from 'mysql2/promise';
import { Request } from 'express';
import { person } from '../schemas/complementary';

export const getLegalCustomers = async (page = 1) => {

  let connection = null;

  try {

    connection = await dbConn()

    const rows = await selectAllFrom(connection, Tables.legal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getNormalCustomers = async (page = 1) => {

  let connection = null;

  try {

    connection = await dbConn()

    const rows = await selectAllFrom(connection, Tables.normal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  finally { if (connection) { connection.release() } }
}

export const getNormalById = async (req: Request) => {

  const { company_id, person_id } = req.query
  let connection = null;

  try {
    connection = await dbConn()
    const baseTable = 'persons';
    const baseAlias = 'p';
    const selectFields = [
      'co.company_id as coCompanyId', 'co.social_name as coSocialName', 'co.cnpj as coCnpj', 'co.corporate_name as coCorporateName',
      'c.*', 'c.company_id AS cCompanyId', 'c.person_id AS cPersonId',
      'a.*', 'a.company_id AS aCompanyId', 'a.person_id AS aPersonId',
      'l.*', 'l.company_id AS lCompanyId', 'l.person_id AS lPersonId',
      'p.*', 'p.company_id AS pCompanyId', 'p.person_id AS pPersonId',
    ];
    const whereConditions = { company_id, person_id };
    const joins = [
      {
        table: Tables.companies, alias: 'co',
        conditions: [{ column1: 'p.company_id', column2: 'co.company_id' }]
      },
      {
        table: Tables.normal_persons, alias: 'l',
        conditions: [{ column1: 'p.company_id', column2: 'l.company_id' }, { column1: 'p.person_id', column2: 'l.person_id' },]
      },
      {
        table: Tables.person_addresses, alias: 'a',
        conditions: [{ column1: 'p.company_id', column2: 'a.company_id' }, { column1: 'p.person_id', column2: 'a.person_id' },]
      },
      {
        table: Tables.person_phones, alias: 'c',
        conditions: [{ column1: 'p.company_id', column2: 'c.company_id' }, { column1: 'p.person_id', column2: 'c.person_id' },]
      }
    ];
    const queryResult = await selectWithJoinsAndWhere(connection, baseTable, baseAlias, selectFields, whereConditions, joins)
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: reduceNormalQueryResult(queryResult) })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const getLegalById = async (req: Request) => {

  const { company_id, person_id } = req.query
  let connection = null;

  try {
    connection = await dbConn()
    const baseTable = 'persons';
    const baseAlias = 'p';
    const selectFields = [
      'co.company_id as coCompanyId', 'co.social_name as coSocialName', 'co.cnpj as coCnpj', 'co.corporate_name as coCorporateName',
      'c.*', 'c.company_id AS cCompanyId', 'c.person_id AS cPersonId',
      'a.*', 'a.company_id AS aCompanyId', 'a.person_id AS aPersonId',
      'l.*', 'l.company_id AS lCompanyId', 'l.person_id AS lPersonId',
      'p.*', 'p.company_id AS pCompanyId', 'p.person_id AS pPersonId',
    ];
    const whereConditions = { company_id, person_id };
    const joins = [
      {
        table: Tables.companies, alias: 'co',
        conditions: [{ column1: 'p.company_id', column2: 'co.company_id' }]
      },
      {
        table: Tables.legal_persons, alias: 'l',
        conditions: [{ column1: 'p.company_id', column2: 'l.company_id' }, { column1: 'p.person_id', column2: 'l.person_id' },]
      },
      {
        table: Tables.person_addresses, alias: 'a',
        conditions: [{ column1: 'p.company_id', column2: 'a.company_id' }, { column1: 'p.person_id', column2: 'a.person_id' },]
      },
      {
        table: Tables.person_phones, alias: 'c',
        conditions: [{ column1: 'p.company_id', column2: 'c.company_id' }, { column1: 'p.person_id', column2: 'c.person_id' },]
      }
    ];
    const queryResult = await selectWithJoinsAndWhere(connection, baseTable, baseAlias, selectFields, whereConditions, joins)
    return objectResponse(200, 'Consulta realizada com sucesso.', { data: reduceLegalQueryResult(queryResult) })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

const reduceNormalQueryResult = (queryResult: QueryResult) => {
  return (queryResult as Array<any>).reduce((acc, curr) => {
    if (!acc.customer) {
      acc = {
        company: {
          company_id: curr.coCompanyId,
          corporate_name: curr.coCorporateName,
          social_name: curr.coSocialName,
          cnpj: curr.coCnpj
        },
        customer: {
          person_id: curr.lPersonId,
          company_id: curr.lCompanyId,
          cpf: curr.cpf,
          first_name: curr.first_name,
          middle_name: curr.middle_name,
          last_name: curr.last_name
        },
        person: {
          person_id: curr.pPersonId,
          company_id: curr.pCompanyId,
          observation: curr.observation,
          first_field: curr.first_field,
          second_field: curr.second_field,
          third_field: curr.third_field
        },
        address: {
          person_id: curr.aPersonId,
          company_id: curr.aCompanyId,
          add_street: curr.add_street,
          add_number: curr.add_number,
          add_uf: curr.add_uf,
          add_zipcode: curr.add_zipcode,
          add_city: curr.add_city,
          add_neighborhood: curr.add_neighborhood,
        },
        contacts: []
      }
    }
    if (!(curr.contact_id === null) && !acc.contacts.some((obj: any) => obj.contact_id === curr.contact_id)) {
      acc.contacts = [...acc.contacts, { contact_id: curr.contact_id, person_id: curr.cPersonId, company_id: curr.cCompanyId, phone_number: curr.phone_number, contact: curr.contact }]
    }
    return acc
  }, {})
}

const reduceLegalQueryResult = (queryResult: QueryResult) => {
  return (queryResult as Array<any>).reduce((acc, curr) => {
    if (!acc.customer) {
      acc = {
        company: {
          company_id: curr.coCompanyId,
          corporate_name: curr.coCorporateName,
          social_name: curr.coSocialName,
          cnpj: curr.coCnpj
        },
        customer: {
          person_id: curr.lPersonId,
          company_id: curr.lCompanyId,
          cnpj: curr.cnpj,
          state_registration: curr.state_registration,
          corporate_name: curr.corporate_name,
          social_name: curr.social_name,
        },
        person: {
          person_id: curr.pPersonId,
          company_id: curr.pCompanyId,
          observation: curr.observation,
          first_field: curr.first_field,
          second_field: curr.second_field,
          third_field: curr.third_field
        },
        address: {
          person_id: curr.aPersonId,
          company_id: curr.aCompanyId,
          add_street: curr.add_street,
          add_number: curr.add_number,
          add_uf: curr.add_uf,
          add_zipcode: curr.add_zipcode,
          add_city: curr.add_city,
          add_neighborhood: curr.add_neighborhood,
        },
        contacts: []
      }
    }
    if (!(curr.contact_id === null) && !acc.contacts.some((obj: any) => obj.contact_id === curr.contact_id)) {
      acc.contacts = [...acc.contacts, { contact_id: curr.contact_id, person_id: curr.person_id, company_id: curr.company_id, phone_number: curr.phone_number, contact: curr.contact }]
    }
    return acc
  }, {})
}

export const createNormalPerson = async (body: any) => {

  let conn = null;

  try {
    conn = await dbConn()
    await conn.beginTransaction()

    const person_id = await selectMaxColumn(conn, Tables.persons, 'person_id', 'max_person_id', 'company_id', parseInt(body.person.company_id as string))
    const contact_id = await selectMaxColumn(conn, Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(body.person.company_id as string))
    const contactsBody = createContacts(body.contacts, person_id, contact_id)

    Promise.all([
      await createPerson(conn, body, person_id),
      await insertInto(conn, Tables.normal_persons, { ...body.customer, person_id }, []),
      await insertInto(conn, Tables.person_addresses, { ...body.address, person_id }, []),
      await duplicateKey(conn, Tables.person_phones, contactsBody)
    ])

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    if (conn) await conn.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (conn) { conn.release() } }
}

export const createLegalPerson = async (body: any) => {

  let conn = null;

  try {
    conn = await dbConn()
    await conn.beginTransaction()

    const person_id = await selectMaxColumn(conn, Tables.persons, 'person_id', 'max_person_id', 'company_id', parseInt(body.person.company_id as string))
    const contact_id = await selectMaxColumn(conn, Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(body.person.company_id as string))

    Promise.all([
      await createPerson(conn, body, person_id),
      await insertInto(conn, Tables.legal_persons, { ...body.customer, person_id }, []),
      await insertInto(conn, Tables.person_addresses, { ...body.address, person_id }, []),
      await duplicateKey(conn, Tables.person_phones, createContacts(body.contacts, person_id, contact_id))
    ])

    await conn.commit()

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    if (conn) await conn.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (conn) { conn.release() } }
}

export const updateLegalPerson = async (req: Request) => {

  const { query, body } = req
  const { company_id, person_id } = query

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const contact_id = await selectMaxColumn(conn, Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(company_id as string))
    const contacts = createContacts(body.contacts, parseInt(person_id as string), contact_id)

    await Promise.all([
      update(conn, Tables.legal_persons, { company_id, person_id }, body.customer, []),
      update(conn, Tables.person_addresses, { company_id, person_id }, body.address, []),
      update(conn, Tables.persons, { company_id, person_id }, body.person, []),
      duplicateKey(conn, Tables.person_phones, contacts)
    ])

    await conn.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    console.log('error', error)
    if (conn) await conn.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (conn) { conn.release() } }
}

export const updateNormalPerson = async (req: Request) => {

  const { query, body } = req
  const { company_id, person_id } = query

  let conn = null;

  try {

    conn = await dbConn()
    await conn.beginTransaction()

    const contact_id = await selectMaxColumn(conn, Tables.person_phones, 'contact_id', 'max_contact_id', 'company_id', parseInt(company_id as string))
    const contacts = createContacts(body.contacts, parseInt(person_id as string), contact_id)

    await Promise.all([
      update(conn, Tables.normal_persons, { company_id, person_id }, body.customer, []),
      update(conn, Tables.person_addresses, { company_id, person_id }, body.address, []),
      update(conn, Tables.persons, { company_id, person_id }, body.person, []),
      duplicateKey(conn, Tables.person_phones, contacts)
    ])

    await conn.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    console.log('error', error)
    if (conn) await conn.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (conn) { conn.release() } }
}

export const deleteCustomerContact = async (req: Request) => {

  let conn = null;

  const { company_id, person_id, contact_id } = req.query

  try {

    conn = await dbConn()

    const result = await deleteFromWhere(
      conn, Tables.person_phones,
      [{ column: 'contact_id', value: parseInt(contact_id as string) }, { column: 'person_id', value: parseInt(person_id as string) }, { column: 'company_id', value: parseInt(company_id as string) }]
    )

    return objectResponse(200, 'Registro Deletado com sucesso', { affectedRows: result.affectedRows })

  }
  catch (error) {
    console.log(error)
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (conn) { conn.release() } }
}

const createPerson = async (connection: PoolConnection, body: any, person_id: number) => {

  const sql =
    `
    INSERT INTO persons (observation, first_field, second_field, third_field, company_id, person_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  const values = [body.person.observation, body.person.first_field, body.person.second_field, body.person.third_field, body.person.company_id, person_id]
  await connection.query(sql, values)
}

const createContacts = (body: any[], person_id: number, contact_id: number) => {
  if (!body.length) { return }
  return body.map((c, index) => {
    if (c.contact_id && c.contact_id != null && c.contact_id != '' && c.contact_id != undefined) { return c }
    const newContact = { person_id, contact_id, company_id: c.company_id, phone_number: c.phone_number, contact: c.contact }
    contact_id += 1
    return newContact
  })
}