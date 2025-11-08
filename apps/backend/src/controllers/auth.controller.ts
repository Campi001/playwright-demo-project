import { Request, Response } from 'express';
import { z } from 'zod';

import { AuthError, AuthService } from '../services/auth.service';

const authService = new AuthService();

const credentialsSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

const extractBearerToken = (req: Request): string => {
  const header = req.headers.authorization;

  if (!header) {
    throw new AuthError('Authorization header missing');
  }

  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new AuthError('Invalid authorization header');
  }

  return token;
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = credentialsSchema.parse(req.body);
    const { token, user } = await authService.login(username, password);

    res.status(200).json({ token, user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid request body', issues: error.flatten() });
      return;
    }

    res.status(500).json({ message: 'Unexpected error' });
  }
};

export const meController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = extractBearerToken(req);
    const user = await authService.getProfileFromToken(token);

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(401).json({ message: 'Invalid token' });
  }
};
