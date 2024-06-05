import { Router, Request, Response, NextFunction } from 'express'
import { createNormalPerson, createLegalPerson, updateLegalPerson, updateNormalPerson, getNormalCustomers, getLegalCustomers, getLegalById, getNormalById } from '../services/customers'
import { validateId, validatePostNormal, validatePostLegal, validatePatchLegal, validatePatchNormal, bodyValidationNormal, bodyValidationLegal } from '../middlewares/validators'
import { legalExistsByDoc, normalExistsByDoc, legalExistsById, normalExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/normal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getNormalCustomers()
  return res.status(result.status).json(result)
})

router.get('/legal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getLegalCustomers()
  return res.status(result.status).json(result)
})

router.get('/normal/:personId', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getNormalById(parseInt(req.params.personId))
  return res.status(result.status).json(result)
})

router.get('/legal/:personId', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getLegalById(parseInt(req.params.personId))
  return res.status(result.status).json(result)
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
  const result = await updateLegalPerson(parseInt(req.params.id), req.body as Person)
  return res.status(result.status).json(result)
})

router.patch('/normal/:id', validateId, validatePatchNormal, bodyValidationNormal, normalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateNormalPerson(parseInt(req.params.id), req.body as Person)
  return res.status(result.status).json(result)
})

export default router