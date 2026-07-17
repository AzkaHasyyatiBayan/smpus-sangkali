import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyToken(req, res)) return;

  if (req.method === 'GET') {
    const data = await prisma.hariLibur.findMany({ orderBy: { tanggal: 'asc' } });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { tanggal, keterangan, jenis } = req.body;
    const newLibur = await prisma.hariLibur.create({
      data: { tanggal: new Date(tanggal), keterangan, jenis },
    });
    return res.status(201).json(newLibur);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}