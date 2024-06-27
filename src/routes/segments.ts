import { Router, Request, Response, NextFunction } from 'express'
import { bodyValidationSegment, validatePatchSegments, validatePostSegments } from '../middlewares/validators'
import { getSegments, createSegment, updateSegment } from '../services/segments'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getSegments(req)
  return res.status(result.status).json(result)
})

router.post('/', validatePostSegments, bodyValidationSegment, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createSegment(req)
  return res.status(result.status).json(result)
})

router.patch('/', validatePatchSegments, bodyValidationSegment, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateSegment(req)
  return res.status(result.status).json(result)
})

export default router