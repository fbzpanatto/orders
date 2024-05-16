import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import customersRouter from './routes/customers';
import addressesRouter from './routes/addresses';
import phonesRouter from './routes/phones'
import segmentsRouter from './routes/segments'
import personSegmentsRouter from './routes/personSegments'
import statusRouter from './routes/status'
import productsRouter from './routes/products'

const app = express()

app.use(morgan('tiny'))

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/api', (req: Request, res: Response) => { res.status(200).send("Hello World") })

app.use('/addresses', addressesRouter)
app.use('/persons', customersRouter)
app.use('/phones', phonesRouter)
app.use('/segments', segmentsRouter)
app.use('/status', statusRouter)
app.use('/products', productsRouter)
app.use('/person-segments', personSegmentsRouter)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => { res.status(500).send({ status: 500, message: error.message }) })

export default app