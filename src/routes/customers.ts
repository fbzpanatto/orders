import { Router, Request, Response, NextFunction } from 'express'
import { createNormalPerson, createLegalPerson, getMultiple, update } from '../services/customers'
import { body, validationResult } from 'express-validator'
import { objectResponse } from '../utils/response'
import { validateId, validatePostNormal, validatePostLegal, validatePatchCustomer } from '../middlewares/validators'
import { legalExistsByDoc, normalExistsByDoc, customerExistsById } from '../middlewares/customerExists'
import { Person } from '../interfaces/person'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await getMultiple() as any
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
})

router.post('/normal', validatePostNormal, normalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {
    const result = await createNormalPerson(req.body as Person)
    return res.status(result.status).json(result)
  }
  catch (error) { next(error) }
});

router.post('/legal', validatePostLegal, legalExistsByDoc, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {
    const result = await createLegalPerson(req.body as Person)
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
})

export default router