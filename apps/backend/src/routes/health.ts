import { Router } from 'express';

const healthRouter: Router = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

export { healthRouter };
