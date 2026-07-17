import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifyToken(req, res)) return;

  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ error: 'month dan year diperlukan' });

  try {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0);
    const deleted = await prisma.kegiatan.deleteMany({
      where: { tanggal: { gte: start, lte: end } },
    });
    return res.json({ message: `${deleted.count} data dihapus` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return res.status(500).json({ error: message });
  }
}