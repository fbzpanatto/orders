import { Router, Request, Response, NextFunction } from 'express'
import { bodyValidationStatus, validatePostStatus, validatePatchStatus } from '../middlewares/validators'
import { getStatus, createStatus, updateStatus } from '../services/status'

const router = Router()

router.get('/', async (req: Request, res: Response ) => {
  const result = await getStatus(req)
  return res.status(result.status).json(result)
})

router.post('/', validatePostStatus, bodyValidationStatus, async (req: Request, res: Response) => {
  const result = await createStatus(req)
  return res.status(result.status).json(result)
})

router.patch('/', validatePatchStatus, bodyValidationStatus, async (req: Request, res: Response) => {
  const result = await updateStatus(req)
  return res.status(result.status).json(result)
})

export default router