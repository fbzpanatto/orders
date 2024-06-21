import { Router, Request, Response, NextFunction } from 'express'
import { validateId, validatePatchField, bodyValidationField, validatePostField } from '../middlewares/validators'
import { getFields, updateField, createField } from '../services/fields'
import { Field } from '../interfaces/field'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getFields(req, 1)
  return res.status(result.status).json(result)
})

router.post('/', validatePostField, bodyValidationField, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createField(req.body as Field)
  return res.status(result.status).json(result)
})

router.patch('/', validatePatchField, bodyValidationField, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateField(req)
  return res.status(result.status).json(result)
})

export default router