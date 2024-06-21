import { Router, Request, Response, NextFunction } from 'express'
import { validatePostUser, validatePatchUser, bodyValidationUser } from '../middlewares/validators'
import { createUser, getUsers, updateUser } from '../services/users'
import { User } from '../interfaces/users'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getUsers(req, 1)
  return res.status(result.status).json(result)
})

router.post('/', validatePostUser, bodyValidationUser, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createUser(req.body as User)
  return res.status(result.status).json(result)
})

router.patch('/', validatePatchUser, bodyValidationUser, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateUser(req)
  return res.status(result.status).json(result)
})

export default router