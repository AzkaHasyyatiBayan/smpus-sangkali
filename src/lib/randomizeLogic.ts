// lib/randomizeLogic.ts
import { prisma } from './prisma';
import {
  PENDAFTARAN_TETAP,
  BP_GIGI_TETAP,
  APOTEK_TETAP,
  LAB_TETAP,
  ADMINISTRASI_TETAP,
  ADMINISTRASI_EXTRA,
  PUSTU_CIANGIR,
  PUSTU_SUMELAP,
  CUTI_KHUSUS,
  DOKTER_WAJIB_KEGIATAN,
  RULES_DOKTER_KEGIATAN,
  POOL_DOKTER,
  POOL_DOKTER_KIA,
  POOL_BIDAN,
  POOL_ILP,
  POOL_DOKTER_F,
  POOL_ILP_F,
  POOL_TINDAKAN_F,
  LOKA_KARYA_MINI_F,
  POOL_PETUGAS_BIDAN_PERAWAT,
  LOKASI_LUAR_GEDUNG,
  JADWAL_POSYANDU_FIXED,
  JADWAL_POSBINDU_FIXED,
  JADWAL_POS_REMAJA_FIXED,
  DAFTAR_UKK,
  DAFTAR_SEKOLAH_PESANTREN,
  KEGIATAN_BOK,
  KEGIATAN_POSYANDU_LIST,
} from './constans';
import type { KegiatanBOKConfig } from './constans';

// ─── INTERFACE ───────────────────────────────────────────────────────────────
interface JadwalItem {
  tanggal: string;
  lokasi: string;
  kegiatan: string;
  penyerta: string;
  kategori: string;
  sub_kategori?: string;
  is_auto_generated: boolean;
}

// ─── Helper Functions ───────────────────────────────────────────────────────
function isOrangLibur(nama: string, tanggal: Date): boolean {
  if (nama in CUTI_KHUSUS) {
    const hari = (tanggal.getDay() + 6) % 7;
    if (hari === 6) return false;
    return CUTI_KHUSUS[nama].includes(hari);
  }
  return false;
}

function isDokterAvailable(nama: string, kegiatan: string, tanggal: Date): boolean {
  const hari = (tanggal.getDay() + 6) % 7;
  if (nama in RULES_DOKTER_KEGIATAN) {
    const rules = RULES_DOKTER_KEGIATAN[nama];
    if (kegiatan in rules) {
      return rules[kegiatan].includes(hari);
    }
  }
  return true;
}

function getDokterWajib(kegiatan: string, hariIdx: number): string | null {
  if (kegiatan in DOKTER_WAJIB_KEGIATAN) {
    const wajib = DOKTER_WAJIB_KEGIATAN[kegiatan];
    if (hariIdx in wajib) return wajib[hariIdx];
  }
  return null;
}

async function cekPiketMalamSebelumnya(tanggal: Date): Promise<string[]> {
  const prev = new Date(tanggal);
  prev.setDate(prev.getDate() - 1);
  const prevStr = prev.toISOString().slice(0, 10);
  const record = await prisma.kegiatan.findFirst({
    where: {
      tanggal: new Date(prevStr),
      kegiatan: { contains: 'PIKET PERSALINAN MALAM' },
    },
  });
  if (record) {
    return record.penyerta.split(';').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
}

async function cekHariLibur(tanggal: Date): Promise<boolean> {
  const tglStr = tanggal.toISOString().slice(0, 10);
  const count = await prisma.hariLibur.count({
    where: { tanggal: new Date(tglStr) },
  });
  return count > 0;
}

async function getWorkDaysInMonth(bulan: number, tahun: number): Promise<Date[]> {
  const workDays: Date[] = [];
  const lastDay = new Date(tahun, bulan, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    const tgl = new Date(tahun, bulan - 1, d);
    if (tgl.getDay() === 0) continue;
    if (await cekHariLibur(tgl)) continue;
    workDays.push(tgl);
  }
  return workDays;
}

function rpf(
  pool: string[],
  count: number,
  usedToday: Set<string>,
  usedMonth: Record<string, number>,
  tanggal: Date,
  kegiatan?: string,
  wajib?: string[]
): string[] {
  if (wajib && wajib.length >= count) {
    const availableWajib = wajib.filter((n: string) => !usedToday.has(n) && !isOrangLibur(n, tanggal));
    if (availableWajib.length >= count) return availableWajib.slice(0, count);
  }

  let available = pool.filter((n: string) => !usedToday.has(n) && !isOrangLibur(n, tanggal));
  if (kegiatan) {
    available = available.filter((n: string) => isDokterAvailable(n, kegiatan, tanggal));
  }

  const belumBulan = available.filter((n: string) => !(n in usedMonth));
  if (belumBulan.length >= count) available = belumBulan;

  if (available.length < count) return [];

  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function rpfSimple(
  pool: string[],
  count: number,
  usedToday: Set<string>,
  tanggal: Date
): string[] {
  const available = pool.filter((n: string) => !usedToday.has(n) && !isOrangLibur(n, tanggal));
  if (available.length < count) return [];
  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function getNthWeekdayDate(year: number, month: number, weekday: number, n: number): Date | null {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay();
  const diff = (weekday - (firstWeekday === 0 ? 6 : firstWeekday - 1) + 7) % 7;
  const firstOccurrence = new Date(firstDay);
  firstOccurrence.setDate(firstDay.getDate() + diff);
  const targetDate = new Date(firstOccurrence);
  targetDate.setDate(firstOccurrence.getDate() + (n - 1) * 7);
  if (targetDate.getMonth() + 1 !== month) return null;
  return targetDate;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE DALAM GEDUNG
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateJadwalDalamGedung(
  bulan: number,
  tahun: number,
  lokaKarya: boolean
): Promise<{ jadwal: JadwalItem[]; skipped: string[] }> {
  const workDays = await getWorkDaysInMonth(bulan, tahun);
  if (workDays.length === 0) {
    return { jadwal: [], skipped: ['Tidak ada hari kerja di bulan ini'] };
  }

  const jadwal: JadwalItem[] = [];
  const skipped: string[] = [];

  const semuaPool = [...POOL_ILP, ...POOL_DOKTER, ...POOL_BIDAN];
  const usedMonth: Record<string, number> = {};
  semuaPool.forEach((n: string) => (usedMonth[n] = 0));

  for (const tgl of workDays) {
    const tglStr = tgl.toISOString().slice(0, 10);
    const hariIdx = (tgl.getDay() + 6) % 7;
    const hariName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][hariIdx];

    const liburMalam = await cekPiketMalamSebelumnya(tgl);
    const usedToday = new Set(liburMalam);

    // a. PENDAFTARAN
    jadwal.push({
      tanggal: tglStr,
      lokasi: 'Dalam Gedung',
      kegiatan: 'PENDAFTARAN',
      penyerta: PENDAFTARAN_TETAP.join('; '),
      kategori: 'dalam_gedung',
      is_auto_generated: true,
    });
    PENDAFTARAN_TETAP.forEach((n: string) => usedToday.add(n));

    // b & c. SKRINING ILP 1 & 2
    for (const keg of ['SKRINING ILP 1', 'SKRINING ILP 2']) {
      const p = rpf(POOL_ILP_F, 1, usedToday, usedMonth, tgl);
      if (p.length) {
        usedToday.add(p[0]);
        usedMonth[p[0]]++;
        jadwal.push({
          tanggal: tglStr,
          lokasi: 'Dalam Gedung',
          kegiatan: keg,
          penyerta: p[0],
          kategori: 'dalam_gedung',
          is_auto_generated: true,
        });
      }
    }

    // d. POLI PROLANIS
    const prolanis = rpf(POOL_ILP_F, 3, usedToday, usedMonth, tgl);
    if (prolanis.length >= 3) {
      prolanis.forEach((n: string) => {
        usedToday.add(n);
        usedMonth[n]++;
      });
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'POLI PROLANIS',
        penyerta: prolanis.join('; '),
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // e. KLASTER DEWASA-LANSIA 1
    let dokWajib = getDokterWajib('KLASTER DEWASA-LANSIA 1', hariIdx);
    let dok = dokWajib && !usedToday.has(dokWajib) && !isOrangLibur(dokWajib, tgl)
      ? [dokWajib]
      : rpf(POOL_DOKTER_F, 1, usedToday, usedMonth, tgl, 'KLASTER DEWASA-LANSIA 1');
    if (dok.length) {
      usedToday.add(dok[0]);
      usedMonth[dok[0]]++;
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'KLASTER DEWASA-LANSIA 1',
        penyerta: dok[0],
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // f. KLASTER DEWASA-LANSIA 2
    dokWajib = getDokterWajib('KLASTER DEWASA-LANSIA 2', hariIdx);
    dok = dokWajib && !usedToday.has(dokWajib) && !isOrangLibur(dokWajib, tgl)
      ? [dokWajib]
      : rpf(POOL_DOKTER_F, 1, usedToday, usedMonth, tgl, 'KLASTER DEWASA-LANSIA 2');
    if (dok.length) {
      usedToday.add(dok[0]);
      usedMonth[dok[0]]++;
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'KLASTER DEWASA-LANSIA 2',
        penyerta: dok[0],
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // g. KLASTER IBU KIA & USG
    dokWajib = getDokterWajib('KLASTER IBU KIA & USG', hariIdx);
    dok = dokWajib && !usedToday.has(dokWajib) && !isOrangLibur(dokWajib, tgl)
      ? [dokWajib]
      : rpf(POOL_DOKTER_KIA, 1, usedToday, usedMonth, tgl, 'KLASTER IBU KIA & USG');
    const bidanKIA = rpf(POOL_BIDAN, 2, usedToday, usedMonth, tgl);
    if (dok.length && bidanKIA.length >= 2) {
      const semua = [...dok, ...bidanKIA];
      semua.forEach((n: string) => {
        usedToday.add(n);
        usedMonth[n]++;
      });
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'KLASTER IBU KIA & USG',
        penyerta: semua.join('; '),
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // h. KLASTER ANAK
    dok = rpf(POOL_DOKTER_KIA, 1, usedToday, usedMonth, tgl, 'KLASTER ANAK');
    const bidanAnak = rpf(POOL_BIDAN, 2, usedToday, usedMonth, tgl);
    if (dok.length && bidanAnak.length >= 2) {
      const semua = [...dok, ...bidanAnak];
      semua.forEach((n: string) => {
        usedToday.add(n);
        usedMonth[n]++;
      });
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'KLASTER ANAK',
        penyerta: semua.join('; '),
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // i. R. IMUNISASI (Kamis)
    if (hariName === 'Kamis') {
      const bidanImun = rpf(POOL_BIDAN, 2, usedToday, usedMonth, tgl);
      if (bidanImun.length >= 2) {
        bidanImun.forEach((n: string) => {
          usedToday.add(n);
          usedMonth[n]++;
        });
        jadwal.push({
          tanggal: tglStr,
          lokasi: 'Dalam Gedung',
          kegiatan: 'R. IMUNISASI',
          penyerta: bidanImun.join('; '),
          kategori: 'dalam_gedung',
          is_auto_generated: true,
        });
      }
    }

    // j. R. TINDAKAN
    const tindakan = rpf(POOL_TINDAKAN_F, 1, usedToday, usedMonth, tgl);
    if (tindakan.length) {
      usedToday.add(tindakan[0]);
      usedMonth[tindakan[0]]++;
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'R. TINDAKAN',
        penyerta: tindakan[0],
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
    }

    // k, l, m. BP GIGI, APOTEK, LAB
    const tetap: [string, string[]][] = [
      ['BP GIGI', BP_GIGI_TETAP],
      ['APOTEK', APOTEK_TETAP],
      ['LAB', LAB_TETAP],
    ];
    tetap.forEach(([keg, staff]) => {
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: keg,
        penyerta: staff.join('; '),
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
      staff.forEach((n: string) => usedToday.add(n));
    });

    // n. R. TB (Selasa)
    if (hariName === 'Selasa') {
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'R. TB',
        penyerta: 'Mutia Wulansari.,S.Kep.,Ners',
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
      usedToday.add('Mutia Wulansari.,S.Kep.,Ners');
      usedMonth['Mutia Wulansari.,S.Kep.,Ners'] =
        (usedMonth['Mutia Wulansari.,S.Kep.,Ners'] || 0) + 1;
    }

    // o. ADMINISTRASI
    const extra = rpf(ADMINISTRASI_EXTRA, 1, usedToday, usedMonth, tgl);
    const admTotal = [...ADMINISTRASI_TETAP, ...extra];
    jadwal.push({
      tanggal: tglStr,
      lokasi: 'Dalam Gedung',
      kegiatan: 'ADMINISTRASI',
      penyerta: admTotal.join('; '),
      kategori: 'dalam_gedung',
      is_auto_generated: true,
    });
    admTotal.forEach((n: string) => {
      usedToday.add(n);
      usedMonth[n] = (usedMonth[n] || 0) + 1;
    });

    // p & q. PUSTU
    const pustuList: [string, string][] = [
      ['Pustu Ciangir', PUSTU_CIANGIR],
      ['Pustu Sumelap', PUSTU_SUMELAP],
    ];
    pustuList.forEach(([lok, staff]) => {
      jadwal.push({
        tanggal: tglStr,
        lokasi: lok,
        kegiatan: 'PELAYANAN PUSTU',
        penyerta: staff,
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
      usedToday.add(staff);
      usedMonth[staff] = (usedMonth[staff] || 0) + 1;
    });

    // Loka Karya Mini (Senin)
    if (lokaKarya && hariName === 'Senin') {
      jadwal.push({
        tanggal: tglStr,
        lokasi: 'Dalam Gedung',
        kegiatan: 'LOKA KARYA MINI BULANAN',
        penyerta: LOKA_KARYA_MINI_F.join('; '),
        kategori: 'dalam_gedung',
        is_auto_generated: true,
      });
      LOKA_KARYA_MINI_F.forEach((n: string) => {
        usedToday.add(n);
        usedMonth[n] = (usedMonth[n] || 0) + 1;
      });
    }
  }

  return { jadwal, skipped };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE BOK (Luar Gedung)
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateJadwalLuarGedungBOK(
  bulan: number,
  tahun: number,
  jadwalDalamGedung?: JadwalItem[]
): Promise<{ jadwal: JadwalItem[]; skipped: string[] }> {
  const workDays = await getWorkDaysInMonth(bulan, tahun);
  if (workDays.length === 0) {
    return { jadwal: [], skipped: ['Tidak ada hari kerja di bulan ini'] };
  }

  const jadwalBaru: JadwalItem[] = [];
  const skipped: string[] = [];

  const usedLuarPerDay: Record<string, Set<string>> = {};
  workDays.forEach(d => (usedLuarPerDay[d.toISOString().slice(0, 10)] = new Set()));

  const doubleLuarTracker: Record<string, Record<string, Set<string>>> = {};
  workDays.forEach(d => (doubleLuarTracker[d.toISOString().slice(0, 10)] = {}));

  const usedDalamPerDay: Record<string, Set<string>> = {};
  if (jadwalDalamGedung) {
    for (const j of jadwalDalamGedung) {
      const tgl = j.tanggal;
      if (!usedDalamPerDay[tgl]) usedDalamPerDay[tgl] = new Set();
      j.penyerta.split(';').forEach((s: string) => usedDalamPerDay[tgl].add(s.trim()));
    }
  }

  const lokasiCount: Record<string, number> = {};
  LOKASI_LUAR_GEDUNG.forEach((lok: string) => (lokasiCount[lok] = 0));

  const workDaysShuffled = [...workDays].sort(() => Math.random() - 0.5);

  const sekolahTerpakai: string[] = [];
  const paketSekolahDates: Record<string, string[]> = {};

  for (const [kegiatanName, config] of Object.entries(KEGIATAN_BOK) as [string, KegiatanBOKConfig][]) {
    const freq = config.freq;
    const petugasPool = config.petugas;
    const penyertaPool = config.penyerta;
    const allowDoubleDalam = config.allow_double_dalam ?? false;
    const allowDoubleLuar = config.allow_double_luar ?? false;
    const lokasiFixed = config.lokasi_fixed ?? null;
    const tanggalFixed = config.tanggal_fixed ?? null;
    const countPenyerta = config.count_penyerta ?? 1;
    const isSekolah = config.is_sekolah ?? false;
    const paketDengan = config.paket_dengan ?? null;

    let placed = 0;
    let attempts = 0;
    const maxAttempts = freq * 100;

    while (placed < freq && attempts < maxAttempts) {
      attempts++;
      let tglObj: Date;
      let tglStr: string;

      if (paketDengan && paketSekolahDates[paketDengan]?.length) {
        tglStr = paketSekolahDates[paketDengan].shift()!;
        tglObj = new Date(tglStr);
      } else if (tanggalFixed) {
        tglObj = new Date(tahun, bulan - 1, tanggalFixed);
        if (!workDays.some(d => d.getTime() === tglObj.getTime())) {
          skipped.push(`${kegiatanName}: Tanggal ${tanggalFixed} bukan hari kerja`);
          break;
        }
      } else {
        if (workDaysShuffled.length === 0) {
          skipped.push(`${kegiatanName}: Tidak ada hari kerja tersedia`);
          break;
        }
        tglObj = workDaysShuffled[Math.floor(Math.random() * workDaysShuffled.length)];
      }
      tglStr = tglObj.toISOString().slice(0, 10);

      if (allowDoubleLuar) {
        let availableLokasi: string[];
        if (lokasiFixed) {
          availableLokasi = [lokasiFixed];
        } else {
          availableLokasi = LOKASI_LUAR_GEDUNG.filter((lok: string) => {
            const key = `${kegiatanName}||${lok}`;
            const existing = doubleLuarTracker[tglStr][key];
            return !existing || existing.size === 0;
          });
        }
        if (availableLokasi.length === 0) continue;
        const lokasi = availableLokasi[Math.floor(Math.random() * availableLokasi.length)];

        const key = `${kegiatanName}||${lokasi}`;
        const existingNames = doubleLuarTracker[tglStr][key] || new Set();

        const petugas = rpfSimple(
          petugasPool.filter((n: string) => !existingNames.has(n)),
          1,
          new Set(),
          tglObj
        );
        if (petugas.length === 0) continue;

        let penyerta: string[] = [];
        if (penyertaPool.length && countPenyerta > 0) {
          const exclude = new Set(petugas);
          existingNames.forEach((n: string) => exclude.add(n));
          if (!allowDoubleDalam && usedDalamPerDay[tglStr]) {
            usedDalamPerDay[tglStr].forEach((n: string) => exclude.add(n));
          }
          const availablePenyerta = penyertaPool.filter(
            (n: string) => !exclude.has(n) && !isOrangLibur(n, tglObj)
          );
          if (availablePenyerta.length >= countPenyerta) {
            const shuffled = [...availablePenyerta].sort(() => Math.random() - 0.5);
            penyerta = shuffled.slice(0, countPenyerta);
          } else if (availablePenyerta.length > 0) {
            penyerta = availablePenyerta;
          } else {
            continue;
          }
        }

        const allNames = [...petugas, ...penyerta];
        if (!doubleLuarTracker[tglStr][key]) doubleLuarTracker[tglStr][key] = new Set();
        allNames.forEach((n: string) => doubleLuarTracker[tglStr][key].add(n));

        jadwalBaru.push({
          tanggal: tglStr,
          lokasi,
          kegiatan: kegiatanName,
          penyerta: allNames.join('; '),
          kategori: 'luar_gedung',
          sub_kategori: 'bok',
          is_auto_generated: true,
        });
        placed++;
      } else {
        const petugas = rpfSimple(petugasPool, 1, usedLuarPerDay[tglStr] || new Set(), tglObj);
        if (petugas.length === 0) continue;

        let penyerta: string[] = [];
        if (penyertaPool.length && countPenyerta > 0) {
          const exclude = new Set(petugas);
          (usedLuarPerDay[tglStr] || new Set()).forEach((n: string) => exclude.add(n));
          if (!allowDoubleDalam && usedDalamPerDay[tglStr]) {
            usedDalamPerDay[tglStr].forEach((n: string) => exclude.add(n));
          }
          const availablePenyerta = penyertaPool.filter(
            (n: string) => !exclude.has(n) && !isOrangLibur(n, tglObj)
          );
          if (availablePenyerta.length >= countPenyerta) {
            const shuffled = [...availablePenyerta].sort(() => Math.random() - 0.5);
            penyerta = shuffled.slice(0, countPenyerta);
          } else {
            continue;
          }
        }

        let lokasi: string;
        if (lokasiFixed) {
          lokasi = lokasiFixed;
        } else if (isSekolah) {
          const sekolahTersedia = DAFTAR_SEKOLAH_PESANTREN.filter((s: string) => !sekolahTerpakai.includes(s));
          if (sekolahTersedia.length > 0) {
            const terpilih = sekolahTersedia[Math.floor(Math.random() * sekolahTersedia.length)];
            sekolahTerpakai.push(terpilih);
            lokasi = `Sekolah/Pesantren ${terpilih}`;
          } else {
            sekolahTerpakai.length = 0;
            const terpilih =
              DAFTAR_SEKOLAH_PESANTREN[Math.floor(Math.random() * DAFTAR_SEKOLAH_PESANTREN.length)];
            sekolahTerpakai.push(terpilih);
            lokasi = `Sekolah/Pesantren ${terpilih}`;
          }
        } else {
          const minLok = Object.keys(lokasiCount).reduce((a, b) =>
            lokasiCount[a] <= lokasiCount[b] ? a : b
          );
          lokasi = minLok;
        }

        const allNames = [...petugas, ...penyerta];
        if (!usedLuarPerDay[tglStr]) usedLuarPerDay[tglStr] = new Set();
        allNames.forEach((n: string) => usedLuarPerDay[tglStr].add(n));
        if (lokasi in lokasiCount) lokasiCount[lokasi]++;

        jadwalBaru.push({
          tanggal: tglStr,
          lokasi,
          kegiatan: kegiatanName,
          penyerta: allNames.join('; '),
          kategori: 'luar_gedung',
          sub_kategori: 'bok',
          is_auto_generated: true,
        });
        placed++;
      }
    }

    if (placed < freq) {
      skipped.push(`${kegiatanName}: Hanya ${placed}/${freq} yang berhasil dijadwalkan`);
    }
  }

  return { jadwal: jadwalBaru, skipped };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE LUAR GEDUNG LAINNYA (Posyandu, Posbindu, UKK, Pos Remaja)
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateJadwalLuarGedungLainnya(
  bulan: number,
  tahun: number,
  jadwalBOK?: JadwalItem[],
  jadwalDalamGedung?: JadwalItem[]
): Promise<{ jadwal: JadwalItem[]; skipped: string[] }> {
  const jadwalBaru: JadwalItem[] = [];
  const skipped: string[] = [];

  const usedPerDay: Record<string, Set<string>> = {};

  const addToUsed = (tgl: string, names: string[]) => {
    if (!usedPerDay[tgl]) usedPerDay[tgl] = new Set();
    names.forEach((n: string) => usedPerDay[tgl].add(n));
  };

  if (jadwalBOK) {
    jadwalBOK.forEach(j => {
      const names = j.penyerta.split(';').map((s: string) => s.trim()).filter(Boolean);
      addToUsed(j.tanggal, names);
    });
  }
  if (jadwalDalamGedung) {
    jadwalDalamGedung.forEach(j => {
      const names = j.penyerta.split(';').map((s: string) => s.trim()).filter(Boolean);
      addToUsed(j.tanggal, names);
    });
  }

  const getDate = (hari: number, mingguKe: number) =>
    getNthWeekdayDate(tahun, bulan, hari, mingguKe);

  // 1. POSYANDU
  const posyanduSlots: {
    tanggal: string;
    lokasi: string;
    kelurahan: string;
    petugas_default: string[];
    penyerta_default: string[];
  }[] = [];
  for (const [namaPos, data] of Object.entries(JADWAL_POSYANDU_FIXED) as [
    string,
    { hari: number; minggu_ke: number; kelurahan: string; petugas: string[]; penyerta: string[] }
  ][]) {
    const tglObj = getDate(data.hari, data.minggu_ke);
    if (tglObj && !(await cekHariLibur(tglObj))) {
      posyanduSlots.push({
        tanggal: tglObj.toISOString().slice(0, 10),
        lokasi: namaPos,
        kelurahan: data.kelurahan,
        petugas_default: data.petugas,
        penyerta_default: data.penyerta,
      });
    }
  }

  for (const [kegName, freq] of KEGIATAN_POSYANDU_LIST) {
    let placed = 0;
    let attempts = 0;
    if (posyanduSlots.length === 0) {
      skipped.push(`${kegName}: Tidak ada slot posyandu tersedia`);
      continue;
    }
    const slotsCopy = [...posyanduSlots].sort(() => Math.random() - 0.5);

    while (placed < freq && attempts < slotsCopy.length * 2) {
      attempts++;
      const slot = slotsCopy[attempts % slotsCopy.length];
      const tglStr = slot.tanggal;

      if (!usedPerDay[tglStr]) usedPerDay[tglStr] = new Set();
      let petugas = slot.petugas_default;
      let penyerta = slot.penyerta_default;

      if (!petugas.length) {
        const p = rpfSimple(POOL_PETUGAS_BIDAN_PERAWAT, 1, usedPerDay[tglStr], new Date(tglStr));
        if (p.length) petugas = p;
      }
      if (!penyerta.length) {
        const exclude = new Set(petugas);
        usedPerDay[tglStr].forEach((n: string) => exclude.add(n));
        const available = POOL_PETUGAS_BIDAN_PERAWAT.filter(
          (n: string) => !exclude.has(n) && !isOrangLibur(n, new Date(tglStr))
        );
        if (available.length > 0) {
          penyerta = [available[Math.floor(Math.random() * available.length)]];
        }
      }
      if (petugas.length && penyerta.length) {
        const allNames = [...petugas, ...penyerta];
        jadwalBaru.push({
          tanggal: tglStr,
          lokasi: slot.lokasi,
          kegiatan: kegName,
          penyerta: allNames.join('; '),
          kategori: 'luar_gedung',
          sub_kategori: 'posyandu',
          is_auto_generated: true,
        });
        allNames.forEach((n: string) => usedPerDay[tglStr].add(n));
        placed++;
      }
    }
    if (placed < freq) skipped.push(`${kegName}: Hanya ${placed}/${freq}`);
  }

  // 2. POSBINDU
  for (const [namaPos, data] of Object.entries(JADWAL_POSBINDU_FIXED) as [
    string,
    { hari: number; minggu_ke: number; kelurahan: string; petugas: string[] }
  ][]) {
    const tglObj = getDate(data.hari, data.minggu_ke);
    if (tglObj && !(await cekHariLibur(tglObj))) {
      const tglStr = tglObj.toISOString().slice(0, 10);
      if (!usedPerDay[tglStr]) usedPerDay[tglStr] = new Set();
      const petugas = data.petugas;
      if (petugas.length) {
        jadwalBaru.push({
          tanggal: tglStr,
          lokasi: namaPos,
          kegiatan: 'Pelaksanaan Posbindu',
          penyerta: petugas.join('; '),
          kategori: 'luar_gedung',
          sub_kategori: 'posbindu',
          is_auto_generated: true,
        });
        petugas.forEach((n: string) => usedPerDay[tglStr].add(n));
      }
    }
  }

  // 3. POS REMAJA
  for (const [namaPos, data] of Object.entries(JADWAL_POS_REMAJA_FIXED) as [
    string,
    { hari: number; minggu_ke: number; kelurahan: string; petugas: string[] }
  ][]) {
    const tglObj = getDate(data.hari, data.minggu_ke);
    if (tglObj && !(await cekHariLibur(tglObj))) {
      const tglStr = tglObj.toISOString().slice(0, 10);
      if (!usedPerDay[tglStr]) usedPerDay[tglStr] = new Set();
      const petugas = data.petugas;
      if (petugas.length) {
        jadwalBaru.push({
          tanggal: tglStr,
          lokasi: namaPos,
          kegiatan: 'Pembinaan Kesehatan di Komunitas',
          penyerta: petugas.join('; '),
          kategori: 'luar_gedung',
          sub_kategori: 'pos_remaja',
          is_auto_generated: true,
        });
        petugas.forEach((n: string) => usedPerDay[tglStr].add(n));
      }
    }
  }

  // 4. UKK
  const workDays = await getWorkDaysInMonth(bulan, tahun);
  for (const ukk of DAFTAR_UKK) {
    if (workDays.length === 0) continue;
    const tglObj = workDays[Math.floor(Math.random() * workDays.length)];
    const tglStr = tglObj.toISOString().slice(0, 10);
    if (!usedPerDay[tglStr]) usedPerDay[tglStr] = new Set();
    const petugas = ukk.petugas;
    if (petugas.length) {
      jadwalBaru.push({
        tanggal: tglStr,
        lokasi: ukk.nama,
        kegiatan: 'Pelayanan UKK',
        penyerta: petugas.join('; '),
        kategori: 'luar_gedung',
        sub_kategori: 'ukk',
        is_auto_generated: true,
      });
      petugas.forEach((n: string) => usedPerDay[tglStr].add(n));
    }
  }

  return { jadwal: jadwalBaru, skipped };
}