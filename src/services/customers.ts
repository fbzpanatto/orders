import { ResultSetHeader, format } from 'mysql2';
import { query } from './db'
import { emptyOrRows } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { Request } from 'express';
import { Tables } from '../enums/tables'
import { insertInto, selectAllFrom, updateTableSetWhere } from '../utils/queries';
import { optionalFields } from '../schemas/optionalFields';
import { formatDate } from '../utils/formatDate';
import { Console } from 'console';

export const getLegalCustomers = async (page = 1) => {
  try {

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

export const getNormalById = async (personId: number) => {

  try {
    const person_id = 'person_id'

    const queryString = `
    SELECT p.*, a.id AS add_id, a.add_street, a.add_number, a.add_zipcode, a.add_city, a.add_neighborhood, c.id AS pc_id, c.phone_number, c.contact
    FROM ${Tables.normal_persons} AS p
    LEFT JOIN ${Tables.person_addresses} AS a ON p.${person_id} = a.${person_id}
    LEFT JOIN ${Tables.person_phones} AS c ON p.${person_id} = c.${person_id}
    WHERE p.${person_id}=?
  `;

    const result = await query(format(queryString, [personId])) as Array<{ [key: string]: any }>

    const aggregatedResult = result.reduce((acc, curr) => {
      if (!acc.person_id) {
        acc = {
          person_id: curr.person_id,
          cpf: curr.cpf,
          first_name: curr.first_name,
          middle_name: curr.middle_name,
          last_name: curr.last_name,
          created_at: curr.created_at,
          updated_at: curr.updated_at,
          address: {
            person_id: curr.person_id,
            id: curr.add_id,
            add_street: curr.add_street,
            add_number: curr.add_number,
            add_zipcode: curr.add_zipcode,
            add_city: curr.add_city,
            add_neighborhood: curr.add_neighborhood
          },
          contacts: []
        };
      }
      if (!(curr.pc_id === null) && !acc.contacts.some((obj: any) => obj.pc_id === curr.pc_id)) {
        acc.contacts = [...acc.contacts, { person_id: curr.person_id, id: curr.pc_id, phone_number: curr.phone_number, contact: curr.contact }]
      }
      return acc;
    }, {});

    return objectResponse(200, 'Consulta realizada com sucesso.', { result: aggregatedResult })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const getLegalById = async (personId: number) => {
  try {
    const table = Tables.legal_persons
    const person_id = 'person_id'

    const queryString = `
      SELECT * FROM ${table}
      WHERE ${person_id}=?
    `

    const result = await query(format(queryString, [personId])) as Array<{ [key: string]: any }>
    return objectResponse(200, 'Consulta realizada com sucesso.', { result })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createNormalPerson = async (body: Person) => {
  try {
    const personId = await createPerson(body)
    const queryResult = await insertInto(Tables.normal_persons, { person_id: personId, ...normalPerson(body) }, Object.keys(optionalFields))
    await insertInto(Tables.person_addresses, address(personId, body), [])
    await createContacts(personId, body)

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
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