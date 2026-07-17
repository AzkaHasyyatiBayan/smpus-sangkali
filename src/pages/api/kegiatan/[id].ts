import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { capitalisasiJudul } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyToken(req, res)) return;

  const { id } = req.query;
  const idNum = parseInt(id as string);

  if (req.method === 'GET') {
    const item = await prisma.kegiatan.findUnique({ where: { id: idNum } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.json(item);
  }

  if (req.method === 'PUT') {
    const { tanggal, lokasi, kegiatan, penyerta, kategori, subKategori } = req.body;
    const updated = await prisma.kegiatan.update({
      where: { id: idNum },
      data: {
        tanggal: new Date(tanggal),
        lokasi,
        kegiatan: capitalisasiJudul(kegiatan),
        penyerta,
        kategori,
        subKategori,
      },
    });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.kegiatan.delete({ where: { id: idNum } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}