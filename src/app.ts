import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import customersRouter from './routes/customers';
import segmentsRouter from './routes/segments'
import personSegmentsRouter from './routes/personSegments'
import statusRouter from './routes/status'
import productsRouter from './routes/products'
import ordersRouter from './routes/orders'
import orderProductsStatus from './routes/orderProductsStatus'
import companies from './routes/companies'
import rolesRouter from './routes/roles'
import permissionsRouter from './routes/permissions'

const app = express()

app.use(morgan('tiny'))

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/api', (req: Request, res: Response) => { res.status(200).send("Hello World") })

app.use('/roles', rolesRouter)
app.use('/status', statusRouter)
app.use('/orders', ordersRouter)
app.use('/companies', companies)
app.use('/persons', customersRouter)
app.use('/segments', segmentsRouter)
app.use('/permissions', permissionsRouter)
app.use('/products', productsRouter)
app.use('/person-segments', personSegmentsRouter)
app.use('/order-products-status', orderProductsStatus)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => { res.status(500).send({ status: 500, message: error.message }) })

export default app