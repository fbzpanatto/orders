import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import customersRouter from './routes/customers';

const app = express()

app.use(morgan('tiny'))

app.use(cors())

app.use(helmet())

app.use(express.json())

// app.use(express.urlencoded({ extended: true }))

app.use('/api', (req: Request, res: Response) => { res.status(200).send("Hello World") })

app.use('/persons', customersRouter)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => { res.status(500).send({ status: 500, message: error.message }) })

export default app