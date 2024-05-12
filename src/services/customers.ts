import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { config } from '../config'
import { emptyOrRows, getOffset } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { Request } from 'express';
import { DatabaseTables } from '../enums/tables'
import { insertInto, updateTableSetWhere } from '../utils/queries';
import { optionalFields } from '../schemas/optionalFields';

export const getMultiple = async (page = 1) => {
  try {

    const offset = getOffset(page, config().listPerPage);
    const rows = await query(
      `
      SELECT p.id AS person_id,
      n.cpf AS cpf,
      CONCAT(n.first_name, ' ', n.last_name) AS full_name,
      l.cnpj AS cnpj,
      l.corporate_name AS corporate_name
      FROM persons AS p
      LEFT JOIN normal_persons AS n ON p.id = n.person_id
      LEFT JOIN legal_persons AS l ON p.id = l.person_id
      LIMIT ${offset},${config().listPerPage}
      `
    );
    const data = emptyOrRows(rows);
    const meta = { page };

    return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
  } catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}

export const createNormalPerson = async (body: Person) => {
  try {
    const normalPersonId = await createPerson(body)
    const queryResult = await insertInto(DatabaseTables.normal_persons, { person_id: normalPersonId, ...body }, Object.keys(optionalFields))

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const createLegalPerson = async (body: Person) => {
  try {
    const legalPersonId = await createPerson(body)
    const queryResult = await insertInto(DatabaseTables.legal_persons, { person_id: legalPersonId, ...body }, Object.keys(optionalFields))

    return objectResponse(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows })
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateLegalPerson = async (personId: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.legal_persons, 'person_id', personId, req.body, Object.keys(optionalFields))
    return objectResponse(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult.affectedRows });
  } catch (error) { return objectResponse(400, 'Não foi possível processar a sua solicitação.') }
}

export const updateNormalPerson = async (personId: number, req: Request) => {
  try {
    const queryResult = await updateTableSetWhere(DatabaseTables.normal_persons, 'person_id', personId, req.body, Object.keys(optionalFields))
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
    body.created_at,
    body.observation,
    body.first_field,
    body.second_field,
    body.third_field
  ]) as ResultSetHeader;

  return personId;
};
