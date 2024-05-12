import { Router, Request, Response, NextFunction } from 'express'
import { validateId } from '../middlewares/validators'
import { bodyValidationSegment, validatePatchSegments, validatePostSegments } from '../middlewares/validators'
import { getSegment, getSegments, createSegment, updateSegment } from '../services/segments'
import { Segments } from '../interfaces/segments'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getSegments()
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getSegment(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostSegments, bodyValidationSegment, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createSegment(req.body as Segments)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchSegments, bodyValidationSegment, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateSegment(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router