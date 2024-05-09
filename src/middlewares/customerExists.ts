import { LegalPerson, NormalPerson, Person } from "../interfaces/person"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'
import { findRegisters } from "../utils/queries"
import { DatabaseTables } from "../enums/tables"
import { validationResult } from 'express-validator'

export const legalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) { return res.status(400).json(objectResponse(400, 'Parâmetros inválidos na requisição.')) }

  const body = req.body as Person

  const result = await findRegisters(DatabaseTables.legal_persons, 'cnpj', body.cnpj as string) as Array<LegalPerson>

  return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()
}

export const normalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) { return res.status(400).json(objectResponse(400, 'Parâmetros inválidos na requisição.')) }

  const body = req.body as Person

  const result = await findRegisters(DatabaseTables.normal_persons, 'cpf', body.cpf as string) as Array<NormalPerson>

  return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()
}

export const legalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  return (await findRegisters(DatabaseTables.legal_persons, 'person_id', parseInt(req.params.id)) as Array<LegalPerson>).length ?
    next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
}

export const normalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  return (await findRegisters(DatabaseTables.normal_persons, 'person_id', parseInt(req.params.id)) as Array<NormalPerson>).length ?
    next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
}