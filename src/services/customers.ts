import { format } from 'mysql2';
import { dbConn } from './db'
import { emptyOrRows } from '../helper'
import { objectResponse } from '../utils/response';
import { Tables } from '../enums/tables'
import { deleteFromWhere, insertInto, selectAllFrom, updateTableSetWhere, selectMaxColumn, duplicateKey } from '../utils/queries';
import { PoolConnection } from 'mysql2/promise';

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

export const getNormalById = async (personId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const person_id = 'person_id'

    const queryString = `
    SELECT p.*, a.person_id AS add_person_id, a.add_uf, a.add_street, a.add_number, a.add_zipcode, a.add_city, a.add_neighborhood, c.id AS pc_id, c.phone_number, c.contact, per.observation, per.id, per.first_field, per.second_field, per.third_field, per.company_id
    FROM ${Tables.normal_persons} AS p
    LEFT JOIN ${Tables.person_addresses} AS a ON p.${person_id} = a.${person_id}
    LEFT JOIN ${Tables.person_phones} AS c ON p.${person_id} = c.${person_id}
    LEFT JOIN ${Tables.persons} AS per ON p.${person_id} = per.id
    WHERE p.${person_id}=?
  `;

    const [result,] = await connection.query(format(queryString, [personId])) as Array<{ [key: string]: any }>

    const aggregatedResult = result.reduce((acc: any, curr: any) => {
      if (!acc.customer) {
        acc = {
          customer: {
            person_id: curr.person_id,
            cpf: curr.cpf,
            first_name: curr.first_name,
            middle_name: curr.middle_name,
            last_name: curr.last_name,
          },
          address: {
            person_id: curr.add_person_id,
            add_street: curr.add_street,
            add_number: curr.add_number,
            add_uf: curr.add_uf,
            add_zipcode: curr.add_zipcode,
            add_city: curr.add_city,
            add_neighborhood: curr.add_neighborhood,
          },
          person: {
            id: curr.id,
            company_id: curr.company_id,
            observation: curr.observation,
            first_field: curr.first_field,
            second_field: curr.second_field,
            third_field: curr.third_field
          },
          contacts: []
        };
      }
      if (!(curr.pc_id === null) && !acc.contacts.some((obj: any) => obj.pc_id === curr.pc_id)) {
        acc.contacts = [...acc.contacts, { id: curr.pc_id, person_id: curr.person_id, phone_number: curr.phone_number, contact: curr.contact }]
      }
      return acc;
    }, {});

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: aggregatedResult })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
}

export const getLegalById = async (personId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const person_id = 'person_id'

    const queryString = `
    SELECT p.*, a.person_id AS add_person_id, a.add_uf, a.add_street, a.add_number, a.add_zipcode, a.add_city, a.add_neighborhood, c.id AS pc_id, c.phone_number, c.contact, per.observation, per.id, per.first_field, per.second_field, per.third_field, per.company_id
    FROM ${Tables.legal_persons} AS p
    LEFT JOIN ${Tables.person_addresses} AS a ON p.${person_id} = a.${person_id}
    LEFT JOIN ${Tables.person_phones} AS c ON p.${person_id} = c.${person_id}
    LEFT JOIN ${Tables.persons} AS per ON p.${person_id} = per.id
    WHERE p.${person_id}=?
  `;

    const [result,] = await connection.query(format(queryString, [personId])) as Array<{ [key: string]: any }>

    const aggregatedResult = result.reduce((acc: any, curr: any) => {
      if (!acc.customer) {
        acc = {
          customer: {
            person_id: curr.person_id,
            cnpj: curr.cnpj,
            corporate_name: curr.corporate_name,
            social_name: curr.social_name,
            state_registration: curr.state_registration,
          },
          address: {
            person_id: curr.add_person_id,
            add_street: curr.add_street,
            add_number: curr.add_number,
            add_uf: curr.add_uf,
            add_zipcode: curr.add_zipcode,
            add_city: curr.add_city,
            add_neighborhood: curr.add_neighborhood,
          },
          person: {
            id: curr.id,
            company_id: curr.company_id,
            observation: curr.observation,
            first_field: curr.first_field,
            second_field: curr.second_field,
            third_field: curr.third_field
          },
          contacts: []
        };
      }
      if (!(curr.pc_id === null) && !acc.contacts.some((obj: any) => obj.pc_id === curr.pc_id)) {
        acc.contacts = [...acc.contacts, { id: curr.pc_id, person_id: curr.person_id, phone_number: curr.phone_number, contact: curr.contact }]
      }
      return acc;
    }, {});

    return objectResponse(200, 'Consulta realizada com sucesso.', { data: aggregatedResult })
  }
  catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
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

export const updateLegalPerson = async (personId: number, body: any) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    await Promise.all([
      updateTableSetWhere(connection, Tables.legal_persons, 'person_id', personId, body.customer, []),
      updateTableSetWhere(connection, Tables.person_addresses, 'person_id', personId, body.address, []),
      updateTableSetWhere(connection, Tables.persons, 'id', personId, body.person, []),
      duplicateKey(connection, Tables.person_phones, body.contacts)
    ])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (connection) { connection.release() } }
}

export const updateNormalPerson = async (personId: number, body: any) => {

  let connection = null;

  try {

    connection = await dbConn()
    await connection.beginTransaction()

    await Promise.all([
      updateTableSetWhere(connection, Tables.normal_persons, 'person_id', personId, body.customer, []),
      updateTableSetWhere(connection, Tables.person_addresses, 'person_id', personId, body.address, []),
      updateTableSetWhere(connection, Tables.persons, 'id', personId, body.person, []),
      duplicateKey(connection, Tables.person_phones, body.contacts)
    ])

    await connection.commit()

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
  }
  catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
  finally { if (connection) { connection.release() } }
}

export const deleteCustomerContact = async (personId: number, contactId: number) => {

  let connection = null;

  try {

    connection = await dbConn()

    const result = await deleteFromWhere(connection, Tables.person_phones, [{ column: 'id', value: contactId }, { column: 'person_id', value: personId }])

    return objectResponse(200, 'Registro Deletado com sucesso', { affectedRows: result.affectedRows })

  }
  catch { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
  finally { if (connection) { connection.release() } }
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
  return body.map((c, index) => {
    if (index != 0) { contact_id += 1 }
    return { person_id, contact_id, company_id: c.company_id, phone_number: c.phone_number, contact: c.contact }
  })
}