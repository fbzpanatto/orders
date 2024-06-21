import { Router, Request, Response, NextFunction } from 'express'
import { getAllOrders, getOrder, getPersonOrders, createOrder, updateOrder } from '../services/orders'
import { Orders } from '../interfaces/orders'
import { validateId, validatePostOrders, validatePatchOrders, bodyValidationOrders } from '../middlewares/validators'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getAllOrders(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getOrder(req)
  return res.status(result.status).json(result)
})

router.get('/person/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPersonOrders(req)
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