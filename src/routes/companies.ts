import { Router, Request, Response, NextFunction } from 'express'
import { validatePostCompany, validatePatchCompany, bodyValidationCompany, validateId } from '../middlewares/validators'
import { createCompany, getCompanies, getCompanyById, updateCompany } from '../services/company'
import { Company } from '../interfaces/company'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getCompanies(1, req)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getCompanyById(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostCompany, bodyValidationCompany, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createCompany(req.body as Company)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchCompany, bodyValidationCompany, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateCompany(parseInt(req.params.id), req.body as Company)
  return res.status(result.status).json(result)
})

export default router