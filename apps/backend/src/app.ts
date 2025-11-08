import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { authRouter } from './routes/auth';
import { healthRouter } from './routes/health';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // fallback error handler to avoid leaking stack traces
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export { app };
