import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifyToken(req, res)) return;

  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids diperlukan' });
  }

  await prisma.kegiatan.deleteMany({ where: { id: { in: ids } } });
  return res.json({ message: `${ids.length} data dihapus.` });
}