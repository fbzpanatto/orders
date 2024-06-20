import { Router, Request, Response, NextFunction } from 'express'
import { Permission } from '../interfaces/permission'
import { createPermission, getRoles, updatePermission } from '../services/permissions'
import { validatePostPermission, bodyValidationPermissions, validatePatchPermissions, validateId } from '../middlewares/validators'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getRoles(req, 1)
  return res.status(result.status).json(result)
})

router.post('/', validatePostPermission, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createPermission(req.body as Permission)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchPermissions, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updatePermission(parseInt(req.params.id), req.body)
  return res.status(result.status).json(result)
})

export default router