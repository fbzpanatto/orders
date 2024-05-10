import { Router, Request, Response, NextFunction } from 'express'
import { createPhone, getPersonPhones, updatePhone } from '../services/phones'
import { PersonPhones } from '../interfaces/phones'
import { bodyValidationAddress, validateId, validatePatchAddresses, validatePersonId, validatePostAddresses } from '../middlewares/validators'

const router = Router()

router.get('/:personId', validatePersonId, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPersonPhones(parseInt(req.params.personId))
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

router.post('/', validatePostAddresses, bodyValidationAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createPhone(req.body as PersonPhones)
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

router.patch('/:id', validateId, validatePatchAddresses, bodyValidationAddress, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updatePhone(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  } catch (error) { next(error) }
})

export default router