import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { tanggal, nama, penyerta } = req.query;

  const where: {
    tanggal?: Date;
    penyerta?: { contains: string };
  } = {};

  if (typeof tanggal === 'string') where.tanggal = new Date(tanggal);
  if (typeof nama === 'string') where.penyerta = { contains: nama };
  if (typeof penyerta === 'string') where.penyerta = { contains: penyerta };

  try {
    const data = await prisma.kegiatan.findMany({ where });
    return res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return res.status(500).json({ error: message });
  }
}