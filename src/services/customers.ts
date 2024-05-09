import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { config } from '../config'
import { emptyOrRows, getOffset } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { formatDate } from '../utils/formatDate';
import { Request } from 'express';
import { PersonCategories } from '../enums/personCategories';
import { DatabaseTables } from '../enums/tables'
import { createRow, updateRow } from '../utils/queries';

export const getMultiple = async (page = 1) => {
  const offset = getOffset(page, config().listPerPage);
  const rows = await query(
    `
    SELECT p.id AS person_id,
    pc.name AS person_category,
    n.cpf AS cpf,
    CONCAT(n.first_name, ' ', n.last_name) AS full_name,
    l.cnpj AS cnpj,
    l.corporate_name AS corporate_name
    FROM persons AS p
    LEFT JOIN person_categories AS pc ON p.person_category_id = pc.id
    LEFT JOIN normal_persons AS n ON p.id = n.person_id
    LEFT JOIN legal_persons AS l ON p.id = l.person_id
    LIMIT ${offset},${config().listPerPage}
    `
  );
  const data = emptyOrRows(rows);
  const meta = { page };

  if (!rows) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
  return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
}

export const createNormalPerson = async (body: Person) => {

  const normalPersonId = await createPerson(body)

  return await createRow(DatabaseTables.normal_persons, { person_id: normalPersonId, ...body }, ['person_category_id'])
}

export const createLegalPerson = async (body: Person) => {

  // TODO: verify if only permited fields.

  const legalPersonId = await createPerson(body)

  return await createRow(DatabaseTables.legal_persons, { person_id: legalPersonId, ...body }, ['person_category_id'])
}

export const updateLegalPerson = async (personId: number, req: Request) => {

  return await updateRow(DatabaseTables.legal_persons, 'person_id', personId, req.body, [])
}

export const updateNormalPerson = async (personId: number, req: Request) => {

  return await updateRow(DatabaseTables.normal_persons, 'person_id', personId, req.body, [])
}

const createPerson = async (body: Person) => {

  let person_category = body.cnpj ? PersonCategories.legal : PersonCategories.normal

  const { insertId: personId } = await query(
    `
    INSERT INTO persons (person_category_id, created_at, updated_at)
    VALUES (${person_category}, '${body.created_at ?? formatDate(new Date())}', '${body.updated_at ?? formatDate(new Date())}')
    `
  ) as ResultSetHeader

  return personId
}