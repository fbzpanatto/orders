import { Router, Request, Response, NextFunction } from 'express'
import { getPersonAddresses, createAddress, updateAdress } from '../services/addresses'
import { PersonAddresses } from '../interfaces/addresses'
import { bodyValidationAddress, validateId, validatePatchAddresses, validatePersonId, validatePostAddresses } from '../middlewares/validators'

const router = Router()

router.get('/:personId', validatePersonId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPersonAddresses(parseInt(req.params.personId))
  return res.status(result.status).json(result)
})

router.post('/', validatePostAddresses, bodyValidationAddress, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createAddress(req.body as PersonAddresses)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchAddresses, bodyValidationAddress, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateAdress(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router