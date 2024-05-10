import { Router, Request, Response, NextFunction } from 'express'
import { createNormalPerson, createLegalPerson, getMultiple, updateLegalPerson, updateNormalPerson } from '../services/customers'
import { validateId, validatePostNormal, validatePostLegal, validatePatchLegal, validatePatchNormal, bodyValidationNormal, bodyValidationLegal } from '../middlewares/validators'
import { legalExistsByDoc, normalExistsByDoc, legalExistsById, normalExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getMultiple() as any
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

router.post('/normal', validatePostNormal, bodyValidationNormal, normalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createNormalPerson(req.body as Person)
  return res.status(result.status).json(result)
});

router.post('/legal', validatePostLegal, bodyValidationLegal, legalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createLegalPerson(req.body as Person)
  return res.status(result.status).json(result)
});

router.patch('/legal/:id', validateId, validatePatchLegal, bodyValidationLegal, legalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateLegalPerson(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

router.patch('/normal/:id', validateId, validatePatchNormal, bodyValidationNormal, normalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateNormalPerson(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

export default router