import { LegalPerson, NormalPerson, Person } from "../interfaces/person"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'
import { selectAllFromWhere } from "../utils/queries"
import { Tables } from "../enums/tables"

export const legalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return (await selectAllFromWhere(Tables.legal_persons, 'cnpj', (req.body.customer as Person).cnpj as string) as Array<LegalPerson>).length ?
      res.status(409).json(objectResponse(409, 'Dado duplicado.')) : next()
  } catch (error) {
    console.log('error', error)
    res.status(400).json(objectResponse(400, 'Não foi possível processar sua requisição.'))
  }
}

export const normalExistsByDoc = async (req: Request, res: Response, next: NextFunction) => {

  console.log('CHEGANDO AQUI')

  try {
    return (await selectAllFromWhere(Tables.normal_persons, 'cpf', (req.body.customer as Person).cpf as string) as Array<NormalPerson>).length ?
      res.status(409).json(objectResponse(409, 'Dado duplicado.')) : next()
  } catch (error) {
    console.log('error', error)
    res.status(400).json(objectResponse(400, 'Não foi possível processar sua requisição.'))
  }
}

export const legalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return (await selectAllFromWhere(Tables.legal_persons, 'person_id', parseInt(req.params.id)) as Array<LegalPerson>).length ?
      next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
  } catch (error) { res.status(400).json(objectResponse(400, 'Não foi possível processar sua requisição.')) }
}

export const normalExistsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return (await selectAllFromWhere(Tables.normal_persons, 'person_id', parseInt(req.params.id)) as Array<NormalPerson>).length ?
      next() : res.status(404).json(objectResponse(404, 'Registro não encontrado.'))
  } catch (error) {
    console.log('normalExistsById', error)
     res.status(400).json(objectResponse(400, 'Não foi possível processar sua requisição.')) 
    }
}