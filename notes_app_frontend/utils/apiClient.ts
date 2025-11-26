import type { FetchOptions } from 'ofetch';

/**
 * PUBLIC_INTERFACE
 * apiClient - Fetch wrapper using Nuxt runtime config public.apiBase.
 * Provides get/post/put/del helpers with timeout and error logging.
 */
export const apiClient = () => {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase || process.env.NUXT_PUBLIC_API_BASE || '').trim();
  const hasBackend = !!baseURL;

  async function request<T>(path: string, opts: RequestInit & { timeoutMs?: number } = {}): Promise<{ ok: boolean; data?: T; error?: any }> {
    if (!hasBackend) {
      return { ok: false, error: new Error('No backend configured') };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 10000);
    try {
      const res = await fetch(baseURL.replace(/\/+$/, '') + path, {
        ...opts,
        headers: {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
        },
        signal: controller.signal,
      });
      const text = await res.text();
      let data: any = undefined;
      try { data = text ? JSON.parse(text) : undefined; } catch { data = text as any; }
      if (!res.ok) {
        console.error('[apiClient] HTTP error', res.status, data);
        return { ok: false, error: data ?? res.statusText };
      }
      return { ok: true, data };
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        console.error('[apiClient] Timeout', path);
        return { ok: false, error: 'timeout' };
      }
      console.error('[apiClient] Network error', err);
      return { ok: false, error: err };
    } finally {
      clearTimeout(timeout);
    }
  }

  // PUBLIC_INTERFACE
  async function get<T>(path: string) { return request<T>(path, { method: 'GET' }); }
  // PUBLIC_INTERFACE
  async function post<T>(path: string, body: any) { return request<T>(path, { method: 'POST', body: JSON.stringify(body) }); }
  // PUBLIC_INTERFACE
  async function put<T>(path: string, body: any) { return request<T>(path, { method: 'PUT', body: JSON.stringify(body) }); }
  // PUBLIC_INTERFACE
  async function del<T>(path: string) { return request<T>(path, { method: 'DELETE' }); }

  return { hasBackend, baseURL, get, post, put, del };
};
