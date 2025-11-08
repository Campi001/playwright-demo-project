import { useCallback, useState } from 'react';

import type { LoginPayload, PublicUser } from '../api/client';
import { login as loginRequest } from '../api/client';

type AuthState = {
  token: string | null;
  user: PublicUser | null;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({ token: null, user: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ username, password }: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await loginRequest({ username, password });
      setState({ token, user });
      return { token, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setState({ token: null, user: null });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    token: state.token,
    user: state.user,
    error,
    loading,
    isAuthenticated: Boolean(state.token),
  };
};
