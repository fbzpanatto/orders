// require('express-async-errors');
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import customerRouter from './routers/customerRouter';

const app = express()

app.use(morgan('tiny'))

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use('/api', (req: Request, res: Response) => { res.status(200).send("Hello World") })

// app.use('/error', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     throw new Error('teste2 deu erro');
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// })

app.use('/customers/', customerRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => { res.status(500).send(error.message) })

export default app