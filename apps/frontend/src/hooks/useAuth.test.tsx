import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { login as loginRequest, type PublicUser } from '../api/client';
import { useAuth } from './useAuth';

vi.mock('../api/client', () => ({
  login: vi.fn(),
}));

const mockUser: PublicUser = {
  id: 'user-demo',
  username: 'demo',
  email: 'demo@example.com',
  fullName: 'Demo User',
};

const loginMock = vi.mocked(loginRequest);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists token and user after successful login', async () => {
    loginMock.mockResolvedValue({ token: 'token-123', user: mockUser });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ username: 'demo', password: 'demo123' });
    });

    expect(loginMock).toHaveBeenCalledWith({ username: 'demo', password: 'demo123' });
    expect(result.current.token).toBe('token-123');
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('captures the error message when login fails', async () => {
    loginMock.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ username: 'demo', password: 'wrong-pass' }).catch(() => {});
    });

    expect(loginMock).toHaveBeenCalled();
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.isAuthenticated).toBe(false);
  });
});
