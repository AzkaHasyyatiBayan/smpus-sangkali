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
        // 🔥 FORMAT INPUT BISA:
        //    - "03/02/2026" (DD/MM/YYYY)
        //    - "2026-02-03" (YYYY-MM-DD) ← dari input date
        // Kita deteksi dan balik biar server baca MM/DD/YYYY
        // =====================================================
        let tanggalDibalik = '';
        
        if (value.includes('/')) {
          // Format: DD/MM/YYYY → balik jadi MM/DD/YYYY
          const parts = value.split('/');
          if (parts.length === 3) {
            const hari = parts[0];
            const bulan = parts[1];
            const tahun = parts[2];
            tanggalDibalik = `${bulan}/${hari}/${tahun}`;
          }
        } else if (value.includes('-')) {
          // Format: YYYY-MM-DD → ubah jadi MM/DD/YYYY
          const parts = value.split('-');
          if (parts.length === 3) {
            const tahun = parts[0];
            const bulan = parts[1];
            const hari = parts[2];
            // Server baca MM/DD/YYYY, jadi kita kirim dalam format itu
            tanggalDibalik = `${bulan}/${hari}/${tahun}`;
          }
        }
        
        console.log('📅 Tanggal asli:', value);
        console.log('📅 Dibalik jadi (MM/DD/YYYY):', tanggalDibalik);
        
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