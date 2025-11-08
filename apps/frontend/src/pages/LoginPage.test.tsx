import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '../hooks/useAuth';
import { LoginPage } from './LoginPage';

type UseAuthReturn = ReturnType<typeof useAuth>;

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

const buildAuthState = (overrides: Partial<UseAuthReturn> = {}): UseAuthReturn => ({
  login: vi.fn(),
  loading: false,
  error: null,
  user: null,
  token: null,
  isAuthenticated: false,
  ...overrides,
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits credentials when the form is valid', async () => {
    const loginSpy = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(buildAuthState({ login: loginSpy }));

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(submitButton).toBeDisabled();

    await userEvent.type(usernameInput, 'demo');
    await userEvent.type(passwordInput, 'demo123');

    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(loginSpy).toHaveBeenCalledWith({ username: 'demo', password: 'demo123' });
  });

  it('renders backend error messages', () => {
    mockUseAuth.mockReturnValue(buildAuthState({ error: 'Invalid credentials' }));

    render(<LoginPage />);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('shows welcome banner when user is authenticated', () => {
    mockUseAuth.mockReturnValue(
      buildAuthState({
        user: {
          id: 'user-demo',
          username: 'demo',
          email: 'demo@example.com',
          fullName: 'Demo User',
        },
      }),
    );

    render(<LoginPage />);

    expect(screen.getByRole('status')).toHaveTextContent('Welcome, demo');
  });
});
