import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifyToken(req, res)) return;

  const { tahun } = req.body;
  if (!tahun) return res.status(400).json({ error: 'tahun diperlukan' });

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${tahun}/ID`);
    const holidays = await response.json();

    let created = 0;
    for (const h of holidays) {
      const exists = await prisma.hariLibur.findUnique({ where: { tanggal: new Date(h.date) } });
      if (!exists) {
        await prisma.hariLibur.create({
          data: {
            tanggal: new Date(h.date),
            keterangan: h.localName || h.name,
            jenis: h.localName?.includes('Cuti Bersama') ? 'cuti_bersama' : 'nasional',
          },
        });
        created++;
      }
    }
    return res.json({ created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return res.status(500).json({ error: message });
  }
}