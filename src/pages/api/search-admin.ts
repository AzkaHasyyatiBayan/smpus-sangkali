import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!verifyToken(req, res)) return;

  const { tanggal, lokasi, kegiatan, penyerta } = req.query;

  // Tentukan tipe filter Prisma
  const where: {
    tanggal?: Date;
    lokasi?: { contains: string };
    kegiatan?: { contains: string };
    penyerta?: { contains: string };
  } = {};

  if (typeof tanggal === 'string') where.tanggal = new Date(tanggal);
  if (typeof lokasi === 'string') where.lokasi = { contains: lokasi };
  if (typeof kegiatan === 'string') where.kegiatan = { contains: kegiatan };
  if (typeof penyerta === 'string') where.penyerta = { contains: penyerta };

  try {
    const data = await prisma.kegiatan.findMany({ where, orderBy: { tanggal: 'desc' } });
    return res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return res.status(500).json({ error: message });
  }
}