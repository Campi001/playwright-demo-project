import { Router } from 'express';

import { loginController, meController } from '../controllers/auth.controller.js';

const authRouter: Router = Router();

authRouter.post('/login', loginController);
authRouter.get('/me', meController);

export { authRouter };
