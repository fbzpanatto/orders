import { Router, Request, Response, NextFunction } from 'express'
import { validateId, validatePostUser, validatePatchUser, bodyValidationUser } from '../middlewares/validators'
import { createUser, getUserById, getUsers, updateUser } from '../services/users'
import { User } from '../interfaces/users'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getUsers(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getUserById(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostUser, bodyValidationUser, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createUser(req.body as User)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchUser, bodyValidationUser, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateUser(parseInt(req.params.id), req.body as User)
  return res.status(result.status).json(result)
})

export default router