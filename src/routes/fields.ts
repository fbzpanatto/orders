import { Router, Request, Response, NextFunction } from 'express'
import { validateId, validatePatchField, bodyValidationField } from '../middlewares/validators'
import { getFields, updateUser } from '../services/fields'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getFields(1)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchField, bodyValidationField, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateUser(parseInt(req.params.id), req.body as any)
  return res.status(result.status).json(result)
})

export default router