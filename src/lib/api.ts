import funcUrls from '../../backend/func2url.json';

const URLS = funcUrls as Record<string, string>;

const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  fn: string,
  options: { method?: string; query?: Record<string, string>; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const base = URLS[fn];
  if (!base) throw new Error(`Неизвестная функция: ${fn}`);

  const url = new URL(base);
  if (options.query) {
    Object.entries(options.query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
    const token = getToken();
    if (token) headers['X-Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Ошибка запроса');
  }
  return data as T;
}

export const authApi = {
  login: (login: string, password: string) =>
    request<{ token: string; login: string }>('admin-auth', {
      method: 'POST',
      query: { action: 'login' },
      body: { login, password },
    }),
  me: () => request<{ login: string }>('admin-auth', { method: 'GET', query: { action: 'me' }, auth: true }),
  logout: () => request<{ ok: true }>('admin-auth', { method: 'POST', query: { action: 'logout' }, auth: true }),
};

export const contentApi = {
  getAll: () => request<Record<string, unknown>>('admin-content'),
  get: (section: string) =>
    request<Record<string, unknown>>('admin-content', { query: { section } }),
  update: (section: string, data: unknown) =>
    request<{ ok: true }>('admin-content', { method: 'PUT', body: { section, data }, auth: true }),
};

export type NewsItemApi = {
  id: number;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  addresses: string | null;
  images: string[];
};

export const newsApi = {
  list: () => request<NewsItemApi[]>('admin-news'),
  get: (id: number) => request<NewsItemApi>('admin-news', { query: { id: String(id) } }),
  create: (payload: Omit<NewsItemApi, 'id'>) =>
    request<{ id: number }>('admin-news', { method: 'POST', body: payload, auth: true }),
  update: (payload: NewsItemApi) =>
    request<{ ok: true }>('admin-news', { method: 'PUT', body: payload, auth: true }),
  remove: (id: number) =>
    request<{ ok: true }>('admin-news', { method: 'DELETE', query: { id: String(id) }, auth: true }),
};

export type MediaItem = {
  id: number;
  url: string;
  filename: string | null;
  label: string | null;
  createdAt: string;
};

export const uploadApi = {
  upload: (file: File, label?: string): Promise<MediaItem> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const data = result.split(',')[1];
          const res = await request<MediaItem>('admin-upload', {
            method: 'POST',
            body: { contentType: file.type, data, filename: file.name, label: label || '' },
            auth: true,
          });
          resolve(res);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.readAsDataURL(file);
    }),
  list: () => request<MediaItem[]>('admin-upload', { auth: true }),
  remove: (id: number) =>
    request<{ ok: true }>('admin-upload', { method: 'DELETE', query: { id: String(id) }, auth: true }),
};