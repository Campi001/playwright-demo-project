import { FormEvent, useState } from 'react';

import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, loading, error, user } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(credentials);
    } catch {
      // error state handled in the hook
    }
  };

  const canSubmit = credentials.username.trim().length > 0 && credentials.password.trim().length > 0;

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <header>
        <h1 style={{ marginBottom: '0.25rem' }}>Login</h1>
        <p style={{ color: '#475569' }}>Use the demo credentials to access the dashboard.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          label="Username"
          name="username"
          autoComplete="username"
          value={credentials.username}
          onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
          required
        />

        <TextField
          type="password"
          label="Password"
          name="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
          required
        />

        {error ? (
          <div style={{ color: '#dc2626', fontSize: '0.9rem' }} role="alert">
            {error}
          </div>
        ) : null}

        <Button type="submit" loading={loading} disabled={!canSubmit || loading}>
          Sign in
        </Button>
      </form>

      {user ? (
        <div
          role="status"
          aria-live="polite"
          style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfccb', borderRadius: '0.5rem' }}
        >
          Welcome, <strong>{user.username}</strong>
        </div>
      ) : null}
    </section>
  );
}
