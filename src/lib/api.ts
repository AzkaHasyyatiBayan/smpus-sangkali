const BASE = '/api/';  

function headers(token?: string) {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Token ${token}`;
  return h;
}

export async function apiGet(path: string, params?: Record<string, string>, token?: string) {
  let url = `${BASE}${path}`;
  if (params && Object.keys(params).length > 0) url += '?' + new URLSearchParams(params).toString();
  const res = await fetch(url, { headers: token ? { Authorization: `Token ${token}` } : {} });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function apiPost(path: string, data: Record<string, unknown>, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

export async function apiPut(path: string, data: Record<string, unknown>, token: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

export async function apiDelete(path: string, token: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Token ${token}` },
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}