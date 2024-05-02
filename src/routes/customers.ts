import { Router, Request, Response, NextFunction } from 'express'
import customers from '../services/customers'

const router = Router()

router.get('/', async function (req: Request, res: Response, next: NextFunction) {

  // TODO: create a function that verifies the req.query.id

  try { res.json(await customers.getMultiple()) }
  catch (error) { next(error) }
})

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try { res.json(await customers.create(req.body)) }
  catch (error) { next(error) }
});

router.put('/:id', async function (req: Request, res: Response, next: NextFunction) {

  // TODO: create a function that verifices the req.params.id

  const id = parseInt(req.params.id)

  try { res.json(await customers.update(id, req.body)) }
  catch (error) { next(error) }
});

router.delete('/:id', async function (req, res, next) {

  // TODO: create a function that verifices the req.params.id

  const id = parseInt(req.params.id)

  try { res.json(await customers.remove(id)) }
  catch (error) { next(error) }
});

export default router