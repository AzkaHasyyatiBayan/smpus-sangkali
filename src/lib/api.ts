const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://web-production-dc35a.up.railway.app/api';

function buildUrl(path: string): string {
  const base = API_BASE.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Token ${token}`;
  return headers;
}

export async function apiGet(
  path: string,
  params?: Record<string, string>,
  token?: string
): Promise<unknown> {
  const base = buildUrl(path);
  
  let query = '';
  if (params) {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      // =============================================
      // 🔥 KIRIM APA ADANYA, JANGAN DIUBAH!
      // =============================================
      urlParams.append(key, value);
      console.log(`📤 ${key}:`, value);
    }
    query = '?' + urlParams.toString();
  }
  
  const url = `${base}${query}`;
  console.log('📡 URL:', url);
  
  const res = await fetch(url, {
    headers: token ? { 'Authorization': `Token ${token}` } : {},
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function apiPost(
  path: string,
  data: Record<string, unknown>,
  token?: string
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

export async function apiPut(
  path: string,
  data: Record<string, unknown>,
  token: string
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

export async function apiDelete(
  path: string,
  token: string
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(buildUrl(path), {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` },
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}