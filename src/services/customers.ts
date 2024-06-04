import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { emptyOrRows } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { Request } from 'express';
import { Tables } from '../enums/tables'
import { insertInto, selectAllFrom, updateTableSetWhere } from '../utils/queries';
import { optionalFields } from '../schemas/optionalFields';
import { formatDate } from '../utils/formatDate';

export const getLegalCustomers = async (page = 1) => {
  try {

    // const queryString = `
    // SELECT p.id AS person_id,
    // n.cpf AS cpf,
    // CONCAT(n.first_name, ' ', n.last_name) AS full_name,
    // l.cnpj AS cnpj,
    // l.corporate_name AS corporate_name
    // FROM persons AS p
    // LEFT JOIN normal_persons AS n ON p.id = n.person_id
    // LEFT JOIN legal_persons AS l ON p.id = l.person_id
    // `

    const rows = await selectAllFrom(Tables.legal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}

export const getNormalCustomers = async (page = 1) => {
  try {
    const rows = await selectAllFrom(Tables.normal_persons, page)
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}

export const createNormalPerson = async (body: Person) => {
  try {
    const personId = await createPerson(body)
    const queryResult = await insertInto(Tables.normal_persons, { person_id: personId, ...normalPerson(body) }, Object.keys(optionalFields))
    await insertInto(Tables.person_addresses, address(personId, body), [])
    await createContacts(personId, body)

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) {

    console.log('------------------------------------------------', error)

    return objectResponse(400, 'Não foi possível processar a sua solicitação.')
  }
}

export const createLegalPerson = async (body: Person) => {
  try {
    const personId = await createPerson(body)
    const queryResult = await insertInto(Tables.legal_persons, { person_id: personId, ...legalPerson(body) }, Object.keys(optionalFields))
    await insertInto(Tables.person_addresses, address(personId, body), [])
    await createContacts(personId, body)

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateLegalPerson = async (personId: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(Tables.legal_persons, 'person_id', personId, req.body, Object.keys(optionalFields))
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateNormalPerson = async (personId: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(Tables.normal_persons, 'person_id', personId, req.body, Object.keys(optionalFields))
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

const createPerson = async (body: Person) => {

  const sql =
    `
    INSERT INTO persons (created_at, observation, first_field, second_field, third_field)
    VALUES (?, ?, ?, ?, ?)
  `

  const { insertId: personId } = await query(sql, [
    formatDate(new Date()),
    body.observation,
    body.first_field,
    body.second_field,
    body.third_field
  ]) as ResultSetHeader;

  return personId;
}

const createContacts = async (personId: number, body: Person) => {
  if (body.contacts && body.contacts.length) {
    for (let item of body.contacts) {
      if (personId && item.name && item.phone) {
        await insertInto(Tables.person_phones, contact(personId, item), [])
      }
    }
  }
}

const legalPerson = (body: Person) => {
  return {
    cnpj: body.cnpj,
    state_registration: body.state_registration,
    corporate_name: body.corporate_name,
    social_name: body.social_name,
    created_at: formatDate(new Date())
  }
}

const normalPerson = (body: Person) => {
  return {
    cpf: body.cpf,
    first_name: body.first_name,
    middle_name: body.middle_name,
    last_name: body.last_name,
    created_at: formatDate(new Date())
  }
}

const address = (personId: number, body: Person) => {
  return {
    person_id: personId,
    add_street: body.add_street,
    add_number: body.add_number,
    add_zipcode: body.add_zipcode,
    add_city: body.add_city,
    add_neighborhood: body.add_neighborhood,
    created_at: formatDate(new Date())
  }
}

const contact = (personId: number, item: { id: number, name: string, phone: string }) => {
  return {
    person_id: personId,
    phone_number: item.phone,
    contact: item.name,
    created_at: formatDate(new Date())
  }
}