import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { capitalisasiJudul } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyToken(req, res)) return;

  if (req.method === 'GET') {
    const data = await prisma.kegiatan.findMany({ orderBy: { tanggal: 'desc' } });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { tanggal, lokasi, kegiatan, penyerta, kategori, subKategori } = req.body;
    const newItem = await prisma.kegiatan.create({
      data: {
        tanggal: new Date(tanggal),
        lokasi,
        kegiatan: capitalisasiJudul(kegiatan),
        penyerta,
        kategori: kategori || 'luar_gedung',
        subKategori: subKategori || 'lainnya',
        source: 'manual',
      },
    });
    return res.status(201).json(newItem);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}