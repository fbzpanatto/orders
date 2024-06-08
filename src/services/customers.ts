import { ResultSetHeader, format } from 'mysql2';
import { myDbConnection } from './db'
import { emptyOrRows } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { Tables } from '../enums/tables'
import { contactsDuplicateKeyUpdate, insertInto, selectAllFrom, updateTableSetWhere } from '../utils/queries';
import { optionalFields } from '../schemas/optionalFields';
import { formatDate } from '../utils/formatDate';

export const getLegalCustomers = async (page = 1) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const rows = await selectAllFrom(connection, Tables.legal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}

export const getNormalCustomers = async (page = 1) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const rows = await selectAllFrom(connection, Tables.normal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}

export const getNormalById = async (personId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const person_id = 'person_id'

    const queryString = `
    SELECT p.*, a.id AS add_id, a.add_street, a.add_number, a.add_zipcode, a.add_city, a.add_neighborhood, c.id AS pc_id, c.phone_number, c.contact
    FROM ${Tables.normal_persons} AS p
    LEFT JOIN ${Tables.person_addresses} AS a ON p.${person_id} = a.${person_id}
    LEFT JOIN ${Tables.person_phones} AS c ON p.${person_id} = c.${person_id}
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
            id: curr.add_id,
            person_id: curr.person_id,
            add_street: curr.add_street,
            add_number: curr.add_number,
            add_zipcode: curr.add_zipcode,
            add_city: curr.add_city,
            add_neighborhood: curr.add_neighborhood,
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
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getLegalById = async (personId: number) => {

  let connection = null;

  try {

    connection = await myDbConnection()

    const person_id = 'person_id'

    const queryString = `
    SELECT p.*, a.id AS add_id, a.add_street, a.add_number, a.add_zipcode, a.add_city, a.add_neighborhood, c.id AS pc_id, c.phone_number, c.contact
    FROM ${Tables.legal_persons} AS p
    LEFT JOIN ${Tables.person_addresses} AS a ON p.${person_id} = a.${person_id}
    LEFT JOIN ${Tables.person_phones} AS c ON p.${person_id} = c.${person_id}
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
            id: curr.add_id,
            person_id: curr.person_id,
            add_street: curr.add_street,
            add_number: curr.add_number,
            add_zipcode: curr.add_zipcode,
            add_city: curr.add_city,
            add_neighborhood: curr.add_neighborhood,
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
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createNormalPerson = async (body: any) => {

  let connection = null;

  const date = formatDate(new Date())
  body.customer.created_at = date
  body.address.created_at = date

  try {

    connection = await myDbConnection()

    const personId = await createPerson(body)
    const queryResult = await insertInto(connection, Tables.normal_persons, { ...body.customer, person_id: personId }, [])
    await insertInto(connection, Tables.person_addresses, { ...body.address, person_id: personId, id: null }, [])
    await createContacts(personId, body)

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createLegalPerson = async (body: any) => {

  let connection = null;

  const date = formatDate(new Date())
  body.customer.created_at = date
  body.address.created_at = date

  try {

    connection = await myDbConnection()

    const personId = await createPerson(body)
    const queryResult = await insertInto(connection, Tables.legal_persons, { ...body.customer, person_id: personId }, [])
    await insertInto(connection, Tables.person_addresses, { ...body.address, person_id: personId, id: null }, [])
    await createContacts(personId, body)

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateLegalPerson = async (personId: number, body: any) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    const [qPerson, qAddress, qContact] = await Promise.all([
      updateTableSetWhere(connection, Tables.legal_persons, 'person_id', personId, body.customer, []),
      updateTableSetWhere(connection, Tables.person_addresses, 'person_id', personId, body.address, []),
      contactsDuplicateKeyUpdate(connection, Tables.person_phones, body.contacts, personId)
    ])

    console.log(qPerson?.affectedRows, qAddress?.affectedRows, qContact?.affectedRows)

    await connection.commit()

    const affectedRows = 1

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}

export const updateNormalPerson = async (personId: number, body: any) => {

  let connection = null;

  try {

    connection = await myDbConnection()
    await connection.beginTransaction()

    await Promise.all([
      updateTableSetWhere(connection, Tables.normal_persons, 'person_id', personId, body.customer, []),
      updateTableSetWhere(connection, Tables.person_addresses, 'person_id', personId, body.address, []),
      contactsDuplicateKeyUpdate(connection, Tables.person_phones, body.contacts, personId)
    ])

    await connection.commit()

    const affectedRows = 1

    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows });
  } catch (error) {
    if (connection) await connection.rollback()
    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}

const createPerson = async (body: any) => {

  let connection = null;

  connection = await myDbConnection()

  // const sql =
  //   `
  //   INSERT INTO persons (created_at, observation, first_field, second_field, third_field)
  //   VALUES (?, ?, ?, ?, ?)
  // `

  // const { insertId: personId } = await query(sql, [
  //   formatDate(new Date()),
  //   body.observation,
  //   body.first_field,
  //   body.second_field,
  //   body.third_field
  // ]) as ResultSetHeader;

  // return personId;

  const sql =
    `
  INSERT INTO persons (created_at)
  VALUES (?)
`

  const { insertId: personId } = await connection.query(sql, [
    body.customer.created_at,
  ]) as unknown as ResultSetHeader;

  return personId;
}

const createContacts = async (personId: number, body: Person) => {

  let connection = null;
  connection = await myDbConnection()

  if (body.contacts && body.contacts.length) {
    for (let item of body.contacts) {
      if (personId && item.contact && item.phone_number) {
        await insertInto(connection, Tables.person_phones, contact(personId, item, true), [])
      }
    }
  }
}

const contact = (personId: number, item: { id: number, contact: string, phone_number: string }, post: boolean) => {

  let key = post ? 'created_at' : 'updated_at'
  let date = { [key]: formatDate(new Date()) }

  return {
    person_id: personId,
    phone_number: item.phone_number,
    contact: item.contact,
    ...date
  }
}