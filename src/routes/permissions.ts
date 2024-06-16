import { Router, Request, Response, NextFunction } from 'express'
import { validatePostPermission, bodyValidationPermissions, validatePatchPermissions, validateRoleId, validatePermissionId } from '../middlewares/validators'
import { createPermission, getPermissions, getPermissionByRole, updatePermission } from '../services/permissions'
import { Company } from '../interfaces/company'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPermissions(1)
  return res.status(result.status).json(result)
})

router.get('/:roleId', validateRoleId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPermissionByRole(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostPermission, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createPermission(req.body as Company)
  return res.status(result.status).json(result)
})

router.patch('/:permissionId', validatePermissionId, validatePatchPermissions, bodyValidationPermissions, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updatePermission(parseInt(req.params.id), req.body)
  return res.status(result.status).json(result)
})

export default router