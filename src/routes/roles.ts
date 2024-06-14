import { Router, Request, Response, NextFunction } from 'express'
import { getRoles } from '../services/roles'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getRoles(1)
  return res.status(result.status).json(result)
})

export default router