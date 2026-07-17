import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) {
    return res.status(500).json({ error: 'Konfigurasi server belum lengkap' });
  }

  try {
    const decoded = jwt.verify(token, AUTH_SECRET) as { username: string };
    return res.json({ username: decoded.username });
  } catch {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}