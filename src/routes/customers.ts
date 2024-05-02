import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'
import { validationResult } from 'express-validator'
import objectResponse from '../utils/response'
import { validateId } from '../middlewares/validators'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {

  // TODO: create a function that verifies the req.query.id

  try {
    const result = await customers.getMultiple() as any
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body

  try {
    const result = await customers.create(body)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.put('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação'))
  }

  try {
    const result = await customers.update(parseInt(req.params.id), req.body)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.delete('/:id', validateId, async (req, res, next) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação'))
  }

  try {
    const result = await customers.remove(parseInt(req.params!.id))
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

export default router