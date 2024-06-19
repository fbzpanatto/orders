import { Router, Request, Response, NextFunction } from 'express'
import { validateId, validatePatchField, bodyValidationField, validatePostField } from '../middlewares/validators'
import { getFields, updateField, getFieldById, createField } from '../services/fields'
import { Field } from '../interfaces/field'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getFields(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getFieldById(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostField, bodyValidationField, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createField(req.body as Field)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchField, bodyValidationField, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateField(parseInt(req.params.id), req.body as Field)
  return res.status(result.status).json(result)
})

export default router