import { LegalPerson, NormalPerson, Person } from "../interfaces/person"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'
import { findRegistersByOneParameter } from "../utils/queries"
import { DatabaseTables } from "../enums/tables"

export const legalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as Person

  return (await findRegistersByOneParameter(DatabaseTables.legal_persons, 'cnpj', body.cnpj as string) as Array<LegalPerson>).length ?
    res.status(409).json(objectResponse(409, 'Dado duplicado.')) : next()
}

export const normalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as Person

  return (await findRegistersByOneParameter(DatabaseTables.normal_persons, 'cpf', body.cpf as string) as Array<NormalPerson>).length ?
    res.status(409).json(objectResponse(409, 'Dado duplicado.')) : next()
}

export const legalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  return (await findRegistersByOneParameter(DatabaseTables.legal_persons, 'person_id', parseInt(req.params.id)) as Array<LegalPerson>).length ?
    next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
}

export const normalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  return (await findRegistersByOneParameter(DatabaseTables.normal_persons, 'person_id', parseInt(req.params.id)) as Array<NormalPerson>).length ?
    next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
}