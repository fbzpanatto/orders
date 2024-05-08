import { Router, Request, Response, NextFunction } from 'express'
import { getOneAddress, createAddress, updateAdress } from '../services/addresses'
import { validationResult } from 'express-validator'
import { objectResponse } from '../utils/response'
import { PersonAddresses } from 'src/interfaces/addresses'
import { validatePostAddresses } from '../middlewares/validators'

const router = Router()

router.get('/:personId', async (req: Request, res: Response, next: NextFunction) => {

  try {

    const result = await getOneAddress(parseInt(req.params.personId))
    return res.status(result.status).json(result)

  }
  catch (error) { next(error) }
})

router.post('/', validatePostAddresses, async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {

    const result = await createAddress(req.body as PersonAddresses)
    return res.status(result.status).json(result)

  }
  catch (error) { next(error) }
})

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json(objectResponse(400, 'Não foi possível processar sua solicitação.'))
  }

  try {

    const result = await updateAdress(parseInt(req.params.id), req)
    return res.status(result.status).json(result)

  }
  catch (error) { next(error) }
})

export default router