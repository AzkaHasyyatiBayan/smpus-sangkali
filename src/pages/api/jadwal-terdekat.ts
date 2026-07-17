import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = await prisma.kegiatan.findMany({
      where: { tanggal: { gte: today } },
      orderBy: { tanggal: 'asc' },
      take: 10,
    });
    return res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return res.status(500).json({ error: message });
  }
}