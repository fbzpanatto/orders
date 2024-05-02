import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'

const router = Router()

router.get('/', async function (req: Request, res: Response, next: NextFunction) {

  const page = parseInt(req.query.page as string) ?? 1

  try { res.json(await customers.getMultiple(page)) }
  catch (error) { next(error) }
})

export default router