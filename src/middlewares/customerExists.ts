import { LegalPerson, NormalPerson, Person } from "src/interfaces/person"
import { objectResponse } from "../utils/response"
import { Request, Response, NextFunction } from 'express'
import { findOnePerson } from "../services/customers"

export const customerExists = async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as Person

  if (body.cnpj) {
    const result = await findOnePerson('legal_persons', 'cnpj', body.cnpj) as Array<LegalPerson>

    return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()

  } else if (body.cpf) {
    const result = await findOnePerson('normal_persons', 'cpf', body.cpf) as Array<NormalPerson>

    return result.length ? res.status(409).json(objectResponse(409, 'Conflito.')) : next()

  } else {
    return res.status(400).json(objectResponse(400, 'CPF ou CNPJ não informado.'))
  }
}