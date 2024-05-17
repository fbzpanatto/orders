import { Router, Request, Response, NextFunction } from 'express'
import { getAllOrders, getOrder, getPersonOrders, createOrder, updateOrder } from '../services/orders'
import { Orders } from '../interfaces/orders'
import { validateId, validatePersonId, validatePostOrders, validatePatchOrders, bodyValidationOrders } from '../middlewares/validators'

const router = Router()

router.get('/:personId', validatePersonId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPersonOrders(parseInt(req.params.personId))
  return res.status(result.status).json(result)
})

router.post('/', validatePostOrders, bodyValidationOrders, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createOrder(req.body as Orders)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchOrders, bodyValidationOrders, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateOrder(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router