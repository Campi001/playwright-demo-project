import { describe, expect, it, beforeEach } from 'vitest';

import { AuthError, AuthService } from '../auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('authenticates the demo user with correct credentials', async () => {
    const { token, user } = await service.login('demo', 'demo123');

    expect(user).toMatchObject({
      id: 'user-demo',
      username: 'demo',
      email: 'demo@example.com',
    });
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  it('rejects unknown usernames', async () => {
    await expect(service.login('unknown', 'demo123')).rejects.toBeInstanceOf(AuthError);
  });

  it('rejects invalid passwords', async () => {
    await expect(service.login('demo', 'wrong-pass')).rejects.toBeInstanceOf(AuthError);
  });

  it('returns the public profile for a valid token', async () => {
    const { token } = await service.login('demo', 'demo123');

    const profile = await service.getProfileFromToken(token);

    expect(profile).toMatchObject({
      id: 'user-demo',
      username: 'demo',
      email: 'demo@example.com',
    });
  });

  it('throws when token payload does not match the demo user', async () => {
    await expect(service.getProfileFromToken('invalid.token.value')).rejects.toBeInstanceOf(
      AuthError,
    );
  });
});
