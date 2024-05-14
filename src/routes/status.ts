import { Router, Request, Response, NextFunction } from 'express'
import { validateId } from '../middlewares/validators'
import { validatePostStatus, validatePatchStatus, bodyValidationStatus } from '../middlewares/validators'
import { createStatus, getOneStatus, getStatus, updateStatus } from '../services/status'
import { Status } from '../interfaces/status'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getStatus(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getOneStatus(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostStatus, bodyValidationStatus, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createStatus(req.body as Status)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchStatus, bodyValidationStatus, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateStatus(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router