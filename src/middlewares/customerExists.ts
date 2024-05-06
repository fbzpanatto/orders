import { LegalPerson, NormalPerson, Person } from "src/interfaces/person"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'
import { findOnePerson } from "../services/customers"
import { DatabaseTables } from "../enums/tables"
import { PersonCategories } from "../enums/personCategories"

export const customerExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as Person

  if (body.cnpj) {
    const result = await findOnePerson(DatabaseTables.legal_persons, 'cnpj', body.cnpj) as Array<LegalPerson>

    return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()

  } else if (body.cpf) {
    const result = await findOnePerson(DatabaseTables.normal_persons, 'cpf', body.cpf) as Array<NormalPerson>

    return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()

  } else { return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.')) }
}

export const customerExistsById = async (req: Request, res: Response, next: NextFunction) => {

  const { query: qParams } = req
  const personCategoryId = qParams['category'] as string

  if (parseInt(personCategoryId) === PersonCategories.legal) {
    return (await findOnePerson(DatabaseTables.legal_persons, 'person_id', parseInt(req.params.id)) as Array<LegalPerson>).length ?
      next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
  }

  else if (parseInt(personCategoryId) === PersonCategories.normal) {

    return (await findOnePerson(DatabaseTables.normal_persons, 'person_id', parseInt(req.params.id)) as Array<NormalPerson>).length ?
      next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
  }

  else { return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.')) }
}