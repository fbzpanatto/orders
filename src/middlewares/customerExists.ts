import { LegalPerson, NormalPerson, Person } from "src/interfaces/person"
import { query } from "../services/db"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'

export const customerExists = async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as Person

  if (body.cnpj) {
    const result = await legalExists(body) as Array<LegalPerson>

    // TODO: create a logging system.
    console.log('Dado duplicado: body.cnpj')
    return result.length ? res.status(409).json(objectResponse(400, 'Não foi possível processar sua solicitação.')) : next()

  } else if (body.cpf) {
    const result = await normalExists(body) as Array<NormalPerson>

    // TODO: create a logging system.
    console.log('Dado duplicado: body.cpf')
    return result.length ? res.status(409).json(objectResponse(400, 'Não foi possível processar sua solicitação.')) : next()
    
  } else {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }
}

const legalExists = async (body: Person) => {
  return await query(
    `
    SELECT * FROM legal_persons WHERE cnpj=${body.cnpj} LIMIT 1
    `
  )
}

const normalExists = async (body: Person) => {
  return await query(
    `
    SELECT * FROM normal_persons WHERE cpf=${body.cpf} LIMIT 1
    `
  )
}