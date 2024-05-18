import { Router, Request, Response, NextFunction } from 'express'
import { OrderProductsStatus } from '../interfaces/order_products_status'
import { getOrderProductsStatus, getAllOrderProductsStatus, createOrderProductsStatus, updateOrderProductsStatus } from '../services/orderProductStatus'
import { validateId, validatePostOrderProductStatus, validatePatchOrderProductStatus, bodyValidationOrderProductStatus } from '../middlewares/validators'

const router = Router()

router.get('/',
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllOrderProductsStatus(1)
    return res.status(result.status).json(result)
  })

router.get('/:id',
  validateId,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOrderProductsStatus(parseInt(req.params.id))
    return res.status(result.status).json(result)
  })

router.post('/',
  validatePostOrderProductStatus,
  bodyValidationOrderProductStatus,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await createOrderProductsStatus(req.body as OrderProductsStatus)
    return res.status(result.status).json(result)
  })

router.patch('/:id',
  validateId,
  validatePatchOrderProductStatus,
  bodyValidationOrderProductStatus,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateOrderProductsStatus(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  })

export default router