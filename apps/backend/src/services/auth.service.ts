import bcrypt from 'bcryptjs';

import { PublicUser, User } from '../domain/user';
import { signAuthToken, verifyAuthToken } from '../utils/jwt';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 401,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const demoUser: User = {
  id: 'user-demo',
  username: 'demo',
  email: 'demo@example.com',
  fullName: 'Demo User',
  passwordHash: '$2y$10$ZHBULG72kwnikDuEFqqr7.uWGjhNx9iyghSGeSXM.DsBRqSw32KRG',
};

export class AuthService {
  private readonly user = demoUser;

  private toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }

  async login(username: string, password: string): Promise<{ token: string; user: PublicUser }> {
    if (username !== this.user.username) {
      throw new AuthError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, this.user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    const token = signAuthToken({
      sub: this.user.id,
      username: this.user.username,
      email: this.user.email,
    });

    return { token, user: this.toPublicUser(this.user) };
  }

  async getProfileFromToken(token: string): Promise<PublicUser> {
    try {
      const payload = verifyAuthToken(token);

      if (payload.sub !== this.user.id) {
        throw new AuthError('Invalid token');
      }

      return this.toPublicUser(this.user);
    } catch {
      throw new AuthError('Invalid token');
    }
  }
}
