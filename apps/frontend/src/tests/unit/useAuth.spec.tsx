import { StrictMode, act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeAll, describe, expect, it } from 'vitest';

type UseAuthHook = typeof import('../../hooks/useAuth')['useAuth'];
type UseAuthReturn = ReturnType<UseAuthHook>;

let useAuthHook: UseAuthHook;

beforeAll(async () => {
  const env = import.meta.env as Record<string, string | undefined>;
  if (!env.VITE_API_BASE && !env.VITE_API_BASE_URL) {
    env.VITE_API_BASE = 'http://localhost:4000/api';
  }

  ({ useAuth: useAuthHook } = await import('../../hooks/useAuth'));
});

const renderUseAuth = () => {
  let hookValue: UseAuthReturn | null = null;

  const Harness = () => {
    hookValue = useAuthHook();
    return null;
  };

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
  });

  if (!hookValue) {
    throw new Error('useAuth did not initialize');
  }

  return {
    result: hookValue,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
};

describe('useAuth (smoke)', () => {
  it('exposes the expected API surface', () => {
    const { result, unmount } = renderUseAuth();

    expect(result).toMatchObject({
      login: expect.any(Function),
      token: null,
      user: null,
      error: null,
      loading: false,
      isAuthenticated: false,
    });

    unmount();
  });
});
