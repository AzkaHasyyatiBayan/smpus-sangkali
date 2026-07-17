import type { NextApiRequest, NextApiResponse } from 'next';

// File ini dulu dipakai sebagai proxy ke Railway backend.
// Sekarang backend sudah dimigrasikan ke Next.js API routes + Prisma + Neon.
// Kalau ada route yang masih 404, berarti belum dibuatkan handler-nya di pages/api/.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ error: 'Route ini belum diimplementasikan di Next.js API.' });
}