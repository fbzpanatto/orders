import { Router, Request, Response, NextFunction } from 'express'
import { validateId } from '../middlewares/validators'
import { validatePostProducts, validatePatchProducts, bodyValidationProducts } from '../middlewares/validators'
import { createProduct, getProduct, getProducts, updateProduct } from '../services/products'
import { Status } from '../interfaces/status'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const result = await getProducts(1)
  return res.status(result.status).json(result)
})

router.get('/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
  const result = await getProduct(parseInt(req.params.id))
  return res.status(result.status).json(result)
})

router.post('/', validatePostProducts, bodyValidationProducts, async (req: Request, res: Response, next: NextFunction) => {
  const result = await createProduct(req.body as Status)
  return res.status(result.status).json(result)
})

router.patch('/:id', validateId, validatePatchProducts, bodyValidationProducts, async (req: Request, res: Response, next: NextFunction) => {
  const result = await updateProduct(parseInt(req.params.id), req)
  return res.status(result.status).json(result)
})

export default router