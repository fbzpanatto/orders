import { Router, Request, Response, NextFunction } from 'express'
import { createNormalPerson, createLegalPerson, updateLegalPerson, updateNormalPerson, getNormalCustomers, getLegalCustomers, getLegalById, getNormalById, deleteCustomerContact } from '../services/customers'
import { validatePostNormal, validatePostLegal, validatePatchLegal, validatePatchNormal, bodyValidationNormal, bodyValidationLegal } from '../middlewares/validators'
import { legalExistsByDoc, normalExistsByDoc, legalExistsById, normalExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/normal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getNormalCustomers(req)
  return res.status(result.status).json(result)
})

router.get('/legal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getLegalCustomers(req)
  return res.status(result.status).json(result)
})

router.get('/normal/select', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getNormalById(req)
  return res.status(result.status).json(result)
})

router.get('/legal/select', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getLegalById(req)
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

router.patch('/legal/patch', validatePatchLegal, bodyValidationLegal, legalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateLegalPerson(req)
  return res.status(result.status).json(result)
})

router.patch('/normal/patch', validatePatchNormal, bodyValidationNormal, normalExistsById, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateNormalPerson(req)
  return res.status(result.status).json(result)
})

router.delete('/normal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await deleteCustomerContact(req)
  return res.status(result.status).json(result)
})

router.delete('/legal', async (req: Request, res: Response, next: NextFunction) => {
  const result = await deleteCustomerContact(req)
  return res.status(result.status).json(result)
})

export default router