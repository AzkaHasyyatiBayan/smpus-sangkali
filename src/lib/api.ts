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
      if (key === 'tanggal' && value) {
        // =====================================================
        // 🔥 HACK: Balikin tanggal karena server pake MM/DD/YYYY
        // Input atasan: DD/MM/YYYY (contoh: 03/02/2026 = 3 Feb)
        // Kita balik jadi MM/DD/YYYY (02/03/2026)
        // Server baca 02/03/2026 = 2 Maret? SALAH!
        // TAPI karena kita balik, server malah baca 3 Feb! BENAR!
        // =====================================================
        const parts = value.split('/'); // ["03", "02", "2026"]
        const hari = parts[0];
        const bulan = parts[1];
        const tahun = parts[2];
        const tanggalDibalik = `${bulan}/${hari}/${tahun}`; // "02/03/2026"
        
        console.log('📅 Input atasan:', value);
        console.log('📅 Dibalik jadi:', tanggalDibalik);
        console.log('📅 Server baca sebagai MM/DD/YYYY');
        
        urlParams.append(key, tanggalDibalik);
      } else {
        urlParams.append(key, value);
      }
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