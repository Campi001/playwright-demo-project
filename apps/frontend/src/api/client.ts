export type LoginPayload = {
  username: string;
  password: string;
};

export type PublicUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
};

export type LoginResponse = {
  token: string;
  user: PublicUser;
};

const apiBaseEnv = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL;

if (!apiBaseEnv) {
  throw new Error('Missing VITE_API_BASE environment variable');
}

const API_BASE_URL = apiBaseEnv.replace(/\/$/, '');

const buildUrl = (path: string): string => `${API_BASE_URL}${path}`;

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message = typeof json?.message === 'string' ? json.message : 'Failed to login';
    throw new Error(message);
  }

  return json as LoginResponse;
}
