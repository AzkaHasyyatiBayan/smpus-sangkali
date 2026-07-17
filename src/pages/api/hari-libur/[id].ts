import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyToken(req, res)) return;

  const { id } = req.query;
  const idNum = parseInt(id as string);

  if (req.method === 'GET') {
    const data = await prisma.hariLibur.findUnique({ where: { id: idNum } });
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    const { tanggal, keterangan, jenis } = req.body;
    const updated = await prisma.hariLibur.update({
      where: { id: idNum },
      data: { tanggal: new Date(tanggal), keterangan, jenis },
    });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.hariLibur.delete({ where: { id: idNum } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}