import type { NextApiRequest, NextApiResponse } from 'next';

const RAILWAY_BASE = 'https://web-production-dc35a.up.railway.app/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ambil parameter dari query
  const { penyerta, tanggal } = req.query;

  console.log('📥 Proxy jadwal-search received:');
  console.log('  - penyerta:', penyerta);
  console.log('  - tanggal:', tanggal);

  // =============================================
  // 🔥 FORMAT TANGGAL: DD/MM/YYYY → YYYY-MM-DD
  // =============================================
  let tanggalISO = tanggal as string;
  if (tanggal && typeof tanggal === 'string' && tanggal.includes('/')) {
    const parts = tanggal.split('/');
    if (parts.length === 3) {
      const hari = parts[0];
      const bulan = parts[1];
      const tahun = parts[2];
      tanggalISO = `${tahun}-${bulan}-${hari}`; // YYYY-MM-DD
      console.log('  - tanggal ISO:', tanggalISO);
    }
  }

  // =============================================
  // 🔥 KIRIM KE BACKEND RAILWAY
  // =============================================
  const url = `${RAILWAY_BASE}/search-user/?penyerta=${encodeURIComponent(penyerta as string)}&tanggal=${tanggalISO}`;
  console.log('📡 Proxy forwarding to:', url);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization as string;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('📡 Backend response status:', response.status);

    const data = await response.json().catch(() => null);
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(502).json({ error: 'Failed to reach backend' });
  }
}