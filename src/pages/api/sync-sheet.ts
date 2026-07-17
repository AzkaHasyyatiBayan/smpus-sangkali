import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifyToken(req, res)) return;

  // Implementasi sync dari Google Sheets akan panjang, untuk sementara berikan respon sukses dummy
  return res.json({ message: 'Fitur sync sheets belum diimplementasikan di versi ini' });
}