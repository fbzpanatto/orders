import { Router, Request, Response, NextFunction } from 'express'
import { createPersonSegment, getPersonSegments, updatePersonSegment } from '../services/personSegments'
import { PersonSegments } from '../interfaces/personSegments'
import { bodyValidationPersonSegments, validateId, validatePostPersonSegments, validatePersonId, validatePatchPersonSegments } from '../middlewares/validators'

const router = Router()

router.get('/:personId', validatePersonId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPersonSegments(req)
  return res.status(result.status).json(result)
})

router.post('/', validatePostPersonSegments, bodyValidationPersonSegments, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createPersonSegment(req.body as PersonSegments)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchPersonSegments, bodyValidationPersonSegments, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updatePersonSegment(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router