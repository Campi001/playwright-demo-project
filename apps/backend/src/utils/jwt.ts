import jwt from 'jsonwebtoken';

import { env } from './env.js';

export type AuthTokenPayload = {
  sub: string;
  username: string;
  email: string;
};

const TOKEN_TTL = '1h';

export const signAuthToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });

export const verifyAuthToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
