import { objectResponse } from '../utils/response'
import { Request, Response, NextFunction } from 'express'

export const invalidValues = (res: Response, req: Request) => {
  return res.status(400).json(objectResponse(400, 'Valor(es) inválido(s) no corpo da requisição.'))
}

export const unexpectedFieldsFn = (req: Request, res: Response, next: NextFunction, schema: { [key: string]: any }) => {

  const unexpectedFields = Object.keys(req.body).filter(key => !schema.hasOwnProperty(key));

  return unexpectedFields.length ? res.status(400).json(objectResponse(400, 'Campo(s) inesperado(s) no corpo da requisição.')) : next()
}