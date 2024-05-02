import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'

const router = Router()

router.get('/', async function (req: Request, res: Response, next: NextFunction) {

  // TODO: create a function that verifies the req.query.id

  try {
    const result = await customers.getMultiple() as any
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.post('/', async function (req: Request, res: Response, next: NextFunction) {

  const body = req.body

  try {
    const result = await customers.create(body)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.put('/:id', async function (req: Request, res: Response, next: NextFunction) {

  // TODO: create a function that verifices the req.params.id

  const id = parseInt(req.params.id)

  try {
    const result = await customers.update(id, req.body)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.delete('/:id', async function (req, res, next) {

  // TODO: create a function that verifices the req.params.id

  const id = parseInt(req.params.id)

  try {
    const result = await customers.remove(id)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

export default router