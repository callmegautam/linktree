import express from 'express';
import { Request, Response } from 'express';
import type { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import env from './config/env';
import globalErrorHandler from './middlewares/error-handler';
import { sendError, sendSuccess } from './utils';
import { HttpStatus } from './types';
import routes from './routes';

const app: Application = express();

const isProduction = env.NODE_ENV === 'PRODUCTION';

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (_: Request, res: Response) => {
  return sendSuccess(res, 'Welcome to Team Sync API', HttpStatus.OK);
});

app.use('/api/v1/', routes);

app.use((_: Request, res: Response) => {
  return sendError(res, 'Api Not Found', HttpStatus.NOT_FOUND);
});

app.use(globalErrorHandler);

export { app };
