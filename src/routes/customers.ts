import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'

const router = Router()

router.get('/', async function (req: Request, res: Response, next: NextFunction) {

  // TODO: create a function that verifies the req.query.id

  try { res.json(await customers.getMultiple()) }
  catch (error) { next(error) }
})

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try { res.json(await customers.create(req.body)) }
  catch (error) { next(error) }
});

export default router