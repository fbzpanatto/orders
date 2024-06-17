import { Router, Request, Response, NextFunction } from 'express'
import { validatePostPermission, bodyValidationPermissions, validatePatchPermissions, validatePermissionId, validateId } from '../middlewares/validators'
import { createPermission, getRoles, getPermissionByRole, updatePermission } from '../services/permissions'
import { Permission } from '../interfaces/permission'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getRoles(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPermissionByRole(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostPermission, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createPermission(req.body as Permission)
  return res.status(result.status).json(result)
})

router.patch('/:permissionId', validatePermissionId, validatePatchPermissions, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updatePermission(parseInt(req.params.id), req.body)
  return res.status(result.status).json(result)
})

export default router