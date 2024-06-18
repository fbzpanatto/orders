import { Router, Request, Response, NextFunction } from 'express'
import { getResources } from '../services/resources'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getResources()
  return res.status(result.status).json(result)
})

export default router