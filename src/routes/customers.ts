import { Router, Request, Response, NextFunction } from 'express'
import { create, getMultiple, remove, update } from '../services/customers'
import { validationResult } from 'express-validator'
import { objectResponse } from '../utils/response'
import { validateId, validatePostCustomer, validatePatchCustomer } from '../middlewares/validators'
import { customerExistsByDoc, customerExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await getMultiple() as any
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.post('/', validatePostCustomer, customerExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {
    const result = await create(req.body as Person)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.patch('/:id', validateId, validatePatchCustomer, customerExistsById, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {
    const result = await update(parseInt(req.params.id), req)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

// router.delete('/:id', validateId, async (req, res, next) => {

//   if (!validationResult(req).isEmpty()) {
//     return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação'))
//   }

//   try {
//     const result = await remove(parseInt(req.params!.id))
//     return res.status(result.status).json(result)
//   }
//   catch (error) { next(error) }
// });

export default router