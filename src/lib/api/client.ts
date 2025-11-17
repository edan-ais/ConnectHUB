async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const url = path.startsWith('http') ? path : `${env.API_BASE_URL}${path}`;
    const res = await fetch(url);
    return handleResponse<T>(res);
  },

  patch: async <T>(path: string, body: unknown): Promise<T> => {
    const url = path.startsWith('http') ? path : `${env.API_BASE_URL}${path}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },
};
