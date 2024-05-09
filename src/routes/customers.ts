import { Router, Request, Response, NextFunction } from 'express'
import { createNormalPerson, createLegalPerson, getMultiple, updateLegalPerson, updateNormalPerson } from '../services/customers'
import { validateId, validatePostNormal, validatePostLegal, validatePatchLegal, validatePatchNormal, validateBodyNormalPerson } from '../middlewares/validators'
import { legalExistsByDoc, normalExistsByDoc, legalExistsById, normalExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await getMultiple() as any
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.post('/normal', validatePostNormal, validateBodyNormalPerson, normalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createNormalPerson(req.body as Person)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.post('/legal', validatePostLegal, legalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createLegalPerson(req.body as Person)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.patch('/legal/:id', validateId, validatePatchLegal, legalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateLegalPerson(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.patch('/normal/:id', validateId, validatePatchNormal, normalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateNormalPerson(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

export default router