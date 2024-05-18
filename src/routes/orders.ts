import { Router, Request, Response, NextFunction } from 'express'
import { getAllOrders, getOrder, getPersonOrders, createOrder, updateOrder } from '../services/orders'
import { Orders } from '../interfaces/orders'
import { validateId, checkPostSchemaOrders, checkPatchSchemaOrders, bodyValidationOrders } from '../middlewares/validators'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getAllOrders(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getOrder(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.get('/person/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getPersonOrders(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', checkPostSchemaOrders, bodyValidationOrders, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createOrder(req.body as Orders)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, checkPatchSchemaOrders, bodyValidationOrders, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateOrder(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router