import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'
import { param, check, validationResult } from 'express-validator'
import objectResponse from '../utils/response'

const validateId = check('id')
  .not().isEmpty()
  .isNumeric()

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

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação'))
  }

  const id = parseInt(req.params.id)

  try {
    const result = await customers.update(id, req.body)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.delete('/:id', async (req, res, next) => {

  // TODO: create a function that verifices the req.params.id

  const id = parseInt(req.params.id)

  try {
    const result = await customers.remove(id)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

export default router