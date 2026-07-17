// ─── DAFTAR SELURUH NAMA PEGAWAI ──────────────────────────────────────────────
export const DAFTAR_NAMA: string[] = [
  "Isep Deni Herdian,S.Kep.,MMRS",
  "Isep Suhendar,SKM",
  "Bdn. Yeni Yulyani Setianingsih,S.ST",
  "Bdn. Nina Ainun,S.Tr.Keb",
  "Rita Sahara,S.Tr.Keb",
  "Dewi Sri Mulyani,Am.Keb",
  "Pipit Puspitasari,Am.Keb",
  "Mira Jatnikawati,Am.Keb",
  "Reni Mustikasari,Am.Keb",
  "Alitsa Nuur Fithri,S.ST",
  "Yesi Apriyani,Am.Keb",
  "Asri Awulan,S.Tr.Keb",
  "Pia Nur Podiana,A.Md.Keb",
  "Intang Sri Purnama,AM.Keb",
  "Ucu Lestari,AM.Keb",
  "Annisa Nafaulloh,S.Tr.Keb.,Bdn",
  "Mutia Wulansari.,S.Kep.,Ners",
  "Ujang Effendi,S.Kep.,Ners",
  "Liska Permatasari,S.Kep.,Ners",
  "Dede Khaerul Kamal Muchtar,AMK",
  "Iman Nurul Haq,A.Md.Kep",
  "Wida Idul Adha,S.Kep.,Ners",
  "Oriany Kemala Dewi,Amd.Kep",
  "Haeriah,A.Md.Kep",
  "Dede Aan Septiantini,A.Md.Kep",
  "dr.Ferry Nalapraya",
  "dr.Muhammad Azhary Romdhon",
  "dr.Iwan Setiawan",
  "dr.Siti Hana Fukui",
  "dr.Volti Diana Suryawadi",
  "drg.Rifan Hanggoro.M.M.R.S",
  "Endah Setiawati,S.Tr.Kes",
  "Khilman Husna Pratama,S.Farm.,Apt",
  "Vita Tyana Virista,A.Md.AK",
  "Gina Giovany,A.Md.AK",
  "Eko Wahyu Saputro,S.K.M",
  "Nurul Hasanah,A.Md.KL",
  "Nova Silpiany Perdany,A.Md.Farm",
  "Ameilia Putri Isyari,S.Gz",
  "Annisa Fauziah,A.Md.Gz",
  "Rudi Sutikno,SKM",
  "Yogi Aris Diyanto,S.E",
  "Rangga Ismardana Gasbela,S.T",
  "Winda Siti Sarah,AMd.RMIK",
  "Pupung Juliana",
  "Salsa Sabila",
  "Andina Dea Priatna,SKM",
  "Iip Supyan"
];

// ─── NAMA YANG DIKECUALIKAN DARI BEBERAPA FITUR ────────────────────────────
export const NAMA_DIECUALIKAN: string[] = [
  "Isep Deni Herdian, S.Kep.,MMRS",
  "Isep Suhendar,SKM"
];

// ─── NAMA YANG TIDAK BOLEH DI KEGIATAN BOK ────────────────────────────────
export const NAMA_TIDAK_BOLEH_BOK: string[] = [
  "Intang Sri Purnama,AM.Keb", "Ameilia Putri Isyari,S.Gz",
  "Ucu Lestari,AM.Keb", "Annisa Nafaulloh,S.Tr.Keb.,Bdn",
  "Dede Aan Septiantini,A.Md.Kep", "Yogi Aris Diyanto,S.E",
  "Rangga Ismardana Gasbela,S.T", "Pupung Juliana",
  "Salsa Sabila", "Andina Dea Priatna,SKM", "Iip Supyan"
];

// ─── NAMA YANG HANYA BOLEH DI PUSTU ────────────────────────────────────────
export const NAMA_HANYA_PUSTU: string[] = [
  "Ujang Effendi,S.Kep.,Ners",
  "Haeriah,A.Md.Kep",
];

// ─── KELOMPOK TETAP ──────────────────────────────────────────────────────────
export const PENDAFTARAN_TETAP: string[] = [
  "Winda Siti Sarah, AMd.RMIK",
  "Pupung Juliana",
  "Salsa Sabila"
];

export const BP_GIGI_TETAP: string[] = [
  "drg.Rifan Hanggoro.M.M.R.S",
  "Endah Setiawati,S.Tr.Kes"
];

export const APOTEK_TETAP: string[] = [
  "Khilman Husna Pratama, S.Farm.,Apt",
  "Nova Silpiany Perdany, A.Md.Farm"
];

export const LAB_TETAP: string[] = [
  "Vita Tyana Virista, A.Md.AK",
  "Gina Giovany, A.Md.AK"
];

export const ADMINISTRASI_TETAP: string[] = [
  "Rangga Ismardana Gasbela,S.T",
  "Yogi Aris Diyanto, S.E"
];

export const ADMINISTRASI_EXTRA: string[] = [
  "Liska Permatasari, S.Kep.,Ners",
  "Alitsa Nuur Fithri, S.ST",
  "Andina Dea Priatna, SKM"
];

export const PUSTU_CIANGIR: string = "Haeriah, A.Md.Kep";
export const PUSTU_SUMELAP: string = "Ujang Effendi, S.Kep.,Ners";

// ─── CUTI KHUSUS ─────────────────────────────────────────────────────────────
export const CUTI_KHUSUS: Record<string, number[]> = {
  'dr.Muhammad Azhary Romdhon': [1, 3],  // Selasa & Kamis
  'dr.Iwan Setiawan': [5],               // Sabtu
};

// ─── DOKTER WAJIB DI KEGIATAN TERTENTU PADA HARI TERTENTU ────────────────────
export const DOKTER_WAJIB_KEGIATAN: Record<string, Record<number, string>> = {
  'KLASTER DEWASA-LANSIA 1': {
    0: 'dr. Volti Diana Suryawadi',
    1: 'dr. Siti Hana Fukui',
  },
  'KLASTER DEWASA-LANSIA 2': {
    5: 'dr. Volti Diana Suryawadi',
    3: 'dr. Siti Hana Fukui',
  },
  'KLASTER IBU KIA & USG': {
    0: 'dr.Muhammad Azhary Romdhon',
    2: 'dr.Muhammad Azhary Romdhon',
    1: 'dr.Ferry Nalapraya',
    3: 'dr.Ferry Nalapraya',
  },
};

// ─── RULES DOKTER ────────────────────────────────────────────────────────────
export const RULES_DOKTER_KEGIATAN: Record<string, Record<string, number[]>> = {
  'dr. Volti Diana Suryawadi': {
    'KLASTER DEWASA-LANSIA 1': [0],
    'KLASTER DEWASA-LANSIA 2': [5],
  },
  'dr. Siti Hana Fukui': {
    'KLASTER DEWASA-LANSIA 1': [1],
    'KLASTER DEWASA-LANSIA 2': [3],
  },
  'dr.Muhammad Azhary Romdhon': {
    'KLASTER IBU KIA & USG': [0, 2],
  },
  'dr.Ferry Nalapraya': {
    'KLASTER IBU KIA & USG': [1, 3],
  },
};

// ─── POOL DALAM GEDUNG (ORIGINAL) ────────────────────────────────────────────
export const POOL_DOKTER = [
  'dr.Ferry Nalapraya', 'dr.Muhammad Azhary Romdhon', 'dr.Iwan Setiawan',
  'dr. Siti Hana Fukui', 'dr. Volti Diana Suryawadi',
  'Mutia Wulansari.,S.Kep.,Ners', 'Ujang Effendi,S.Kep.,Ners',
  'Liska Permatasari,S.Kep.,Ners', 'Wida Idul Adha,S.Kep.,Ners',
];
export const POOL_DOKTER_KIA = [
  'dr.Ferry Nalapraya', 'dr.Muhammad Azhary Romdhon', 'dr.Iwan Setiawan',
];
export const POOL_BIDAN = [
  'Bdn. Yeni Yulyani Setianingsih,S.ST', 'Bdn. Nina Ainun,S.Tr.Keb',
  'Rita Sahara,S.Tr.Keb', 'Dewi Sri Mulyani,Am.Keb',
  'Pipit Puspitasari,Am.Keb', 'Mira Jatnikawati,Am.Keb',
  'Reni Mustikasari,Am.Keb', 'Alitsa Nuur Fithri,S.ST',
  'Yesi Apriyani,Am.Keb', 'Asri Awulan,S.Tr.Keb',
  'Pia Nur Podiana,A.Md.Keb', 'Intang Sri Purnama,AM.Keb',
  'Ucu Lestari,AM.Keb', 'Annisa Nafaulloh,S.Tr.Keb.,Bdn',
];
export const POOL_ILP = [
  'Mutia Wulansari.,S.Kep.,Ners', 'Liska Permatasari,S.Kep.,Ners',
  'Dede Khaerul Kamal Muchtar,AMK', 'Iman Nurul Haq,A.Md.Kep',
  'Wida Idul Adha,S.Kep.,Ners', 'Oriany Kemala Dewi,Amd.Kep',
  'Dede Aan Septiantini,A.Md.Kep', 'Bdn. Yeni Yulyani Setianingsih,S.ST',
  'Bdn. Nina Ainun,S.Tr.Keb', 'Rita Sahara,S.Tr.Keb',
  'Dewi Sri Mulyani,Am.Keb', 'Pipit Puspitasari,Am.Keb',
  'Mira Jatnikawati,Am.Keb', 'Reni Mustikasari,Am.Keb',
  'Alitsa Nuur Fithri,S.ST', 'Yesi Apriyani,Am.Keb',
  'Asri Awulan,S.Tr.Keb', 'Pia Nur Podiana,A.Md.Keb',
  'Intang Sri Purnama,AM.Keb', 'Ucu Lestari,AM.Keb',
  'Annisa Nafaulloh,S.Tr.Keb.,Bdn', 'Rudi Sutikno,SKM',
  'Eko Wahyu Saputro,S.K.M', 'Nurul Hasanah,A.Md.KL',
  'Ameilia Putri Isyari,S.Gz', 'Annisa Fauziah,A.Md.Gz',
];
export const POOL_TINDAKAN = [
  'Mutia Wulansari.,S.Kep.,Ners', 'Liska Permatasari,S.Kep.,Ners',
  'Dede Khaerul Kamal Muchtar,AMK', 'Iman Nurul Haq,A.Md.Kep',
  'Wida Idul Adha,S.Kep.,Ners', 'Oriany Kemala Dewi,Amd.Kep',
  'Dede Aan Septiantini,A.Md.Kep',
];
export const LOKA_KARYA_MINI = [
  'Dewi Sri Mulyani,Am.Keb', 'Pipit Puspitasari,Am.Keb',
  'Mira Jatnikawati,Am.Keb', 'Reni Mustikasari,Am.Keb',
  'Asri Awulan,S.Tr.Keb', 'Ujang Effendi,S.Kep.,Ners',
  'Haeriah,A.Md.Kep',
];

// ─── POOL DALAM GEDUNG (FILTERED - TANPA UJANG & HAERIAH) ────────────────────
export const POOL_DOKTER_F = POOL_DOKTER.filter(n => !NAMA_HANYA_PUSTU.includes(n));
export const POOL_ILP_F = POOL_ILP.filter(n => !NAMA_HANYA_PUSTU.includes(n));
export const POOL_TINDAKAN_F = POOL_TINDAKAN.filter(n => !NAMA_HANYA_PUSTU.includes(n));
export const LOKA_KARYA_MINI_F = LOKA_KARYA_MINI.filter(n => !NAMA_HANYA_PUSTU.includes(n));

// ─── POOL LUAR GEDUNG ────────────────────────────────────────────────────────
export const POOL_PETUGAS_DOKTER_GIGI = [
  'dr.Ferry Nalapraya', 'drg.Rifan Hanggoro.M.M.R.S',
];
export const POOL_PETUGAS_BIDAN_PERAWAT = [
  'Bdn. Yeni Yulyani Setianingsih,S.ST', 'Bdn. Nina Ainun,S.Tr.Keb',
  'Rita Sahara,S.Tr.Keb', 'Dewi Sri Mulyani,Am.Keb',
  'Pipit Puspitasari,Am.Keb', 'Mira Jatnikawati,Am.Keb',
  'Reni Mustikasari,Am.Keb', 'Alitsa Nuur Fithri,S.ST',
  'Yesi Apriyani,Am.Keb', 'Asri Awulan,S.Tr.Keb',
  'Pia Nur Podiana,A.Md.Keb', 'Mutia Wulansari.,S.Kep.,Ners',
  'Ujang Effendi,S.Kep.,Ners', 'Liska Permatasari,S.Kep.,Ners',
  'Dede Khaerul Kamal Muchtar,AMK', 'Iman Nurul Haq,A.Md.Kep',
  'Wida Idul Adha,S.Kep.,Ners', 'Oriany Kemala Dewi,Amd.Kep',
  'Haeriah,A.Md.Kep', 'Annisa Fauziah,A.Md.Gz',
];
export const POOL_PETUGAS_SANITARIAN = [
  'Isep Suhendar,SKM', 'Eko Wahyu Saputro,S.K.M', 'Rudi Sutikno,SKM',
];
export const POOL_PETUGAS_STBM = [
  'Eko Wahyu Saputro,S.K.M', 'Nurul Hasanah,A.Md.KL', 'Rudi Sutikno,SKM',
];
export const LOKASI_LUAR_GEDUNG = ['Tamanjaya', 'Tamansari', 'Sumelap', 'Mugarsari'];

// ─── JADWAL FIXED POSYANDU ──────────────────────────────────────────────────
export const JADWAL_POSYANDU_FIXED: Record<string, {
  hari: number; minggu_ke: number; kelurahan: string; petugas: string[]; penyerta: string[];
}> = {
  'Posyandu Cieurih': { hari: 0, minggu_ke: 1, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Wida Idul Adha,S.Kep.,Ners'] },
  'Posyandu Liunggunung': { hari: 1, minggu_ke: 1, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Dede Khaerul Kamal Muchtar,AMK'] },
  'Posyandu Kadupandak': { hari: 2, minggu_ke: 1, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Oriany Kemala Dewi,Amd.Kep'] },
  'Posyandu Perum Puri Sumelap': { hari: 0, minggu_ke: 2, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: [] },
  'Posyandu Babakan Jati': { hari: 1, minggu_ke: 2, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Yesi Apriyani,Am.Keb'] },
  'Posyandu Sumelap': { hari: 2, minggu_ke: 2, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: [] },
  'Posyandu Sukaasih': { hari: 0, minggu_ke: 3, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Ucu Lestari,AM.Keb'] },
  'Posyandu Perum Sukawening': { hari: 1, minggu_ke: 3, kelurahan: 'Sumelap', petugas: ['Asri Awulan, S.Tr.Keb'], penyerta: ['Ucu Lestari, AM.Keb'] },
  'Posyandu Cigintung': { hari: 2, minggu_ke: 3, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: ['Annisa Nafaulloh,S.Tr.Keb.,Bdn'] },
  'Posyandu Ciharashas': { hari: 0, minggu_ke: 1, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'], penyerta: [] },
  'Posyandu Kubangsari': { hari: 0, minggu_ke: 1, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Dede Aan Septiantini,A.Md.Kep'] },
  'Posyandu Malingping': { hari: 1, minggu_ke: 1, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Iman Nurul Haq,A.Md.Kep'] },
  'Posyandu Sindangreret': { hari: 2, minggu_ke: 1, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Alitsa Nuur Fithri,S.ST'] },
  'Posyandu Karisma': { hari: 3, minggu_ke: 1, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Alitsa Nuur Fithri,S.ST'] },
  'Posyandu Cibeureum': { hari: 0, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Dede Aan Septiantini,A.Md.Kep'] },
  'Posyandu Nagarasari': { hari: 1, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Liska Permatasari,S.Kep.,Ners'] },
  'Posyandu Situdukun': { hari: 2, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: [] },
  'Posyandu Gegernoong': { hari: 3, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: [] },
  'Posyandu Taman': { hari: 4, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Pia Nur Podiana,A.Md.Keb'] },
  'Posyandu Harapan Bunda': { hari: 5, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Annisa Nafaulloh,S.Tr.Keb.,Bdn'] },
  'Posyandu Kasih Bunda': { hari: 0, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Pia Nur Podiana,A.Md.Keb'] },
  'Posyandu Cidahu': { hari: 1, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Oriany Kemala Dewi,Amd.Kep'] },
  'Posyandu Perum Nusa Indah': { hari: 2, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Liska Permatasari,S.Kep.,Ners'] },
  'Posyandu Bantarsari': { hari: 3, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Pipit Puspitasari,Am.Keb'], penyerta: ['Iman Nurul Haq,A.Md.Kep'] },
  'Posyandu Selaawi': { hari: 1, minggu_ke: 1, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Wida Idul Adha,S.Kep.,Ners'] },
  'Posyandu Sidamulih': { hari: 3, minggu_ke: 1, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Bdn. Nina Ainun,S.Tr.Keb'] },
  'Posyandu Bbk.Cipasung': { hari: 1, minggu_ke: 2, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Wida Idul Adha,S.Kep.,Ners'] },
  'Posyandu Nangela': { hari: 2, minggu_ke: 2, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Bdn. Nina Ainun,S.Tr.Keb'] },
  'Posyandu Jatiwangi': { hari: 3, minggu_ke: 2, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: [] },
  'Posyandu Cipasung': { hari: 1, minggu_ke: 3, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Ujang Effendi,S.Kep.,Ners'] },
  'Posyandu Kubang': { hari: 2, minggu_ke: 3, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: ['Ujang Effendi,S.Kep.,Ners'] },
  'Posyandu Nyantong': { hari: 3, minggu_ke: 3, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'], penyerta: [] },
  'Posyandu Sinargalih': { hari: 0, minggu_ke: 1, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Iman Nurul Haq,A.Md.Kep', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Ciatal': { hari: 2, minggu_ke: 1, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Reni Mustikasari,Am.Keb'] },
  'Posyandu Bandung': { hari: 3, minggu_ke: 1, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Dede Khaerul Kamal Muchtar,AMK', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Cipajaran': { hari: 4, minggu_ke: 1, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Bdn. Yeni Yulyani Setianingsih,S.ST', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Situhiang': { hari: 0, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Reni Mustikasari Am.Keb'] },
  'Posyandu Ciledug': { hari: 1, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Reni Mustikasari,Am.Keb'] },
  'Posyandu Selakaso': { hari: 2, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Iman Nurul Haq,A.Md.Kep', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Cipamutih': { hari: 3, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Yesi Apriyani,Am.Keb', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Sangkali': { hari: 4, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Bdn. Yeni Yulyani Setianingsih,S.ST', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Ciangir': { hari: 0, minggu_ke: 3, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Haeriah,A.Md.Kep', 'Reni Mustikasari,Am.Keb'] },
  'Posyandu Cipangebak': { hari: 3, minggu_ke: 3, kelurahan: 'Tamansari', petugas: ['Mira Jatnikawati,Am.Keb'], penyerta: ['Haeriah,A.Md.Kep', 'Reni Mustikasari,Am.Keb'] },
};

// ─── JADWAL FIXED POSBINDU & POS REMAJA ─────────────────────────────────────
export const JADWAL_POSBINDU_FIXED: Record<string, {
  hari: number; minggu_ke: number; kelurahan: string; petugas: string[];
}> = {
  'Posbindu Cigintung': { hari: 2, minggu_ke: 3, kelurahan: 'Sumelap', petugas: ['Annisa Nafaulloh,S.Tr.Keb.,Bdn'] },
  'Posbindu Sindangreret': { hari: 3, minggu_ke: 1, kelurahan: 'Tamanjaya', petugas: ['Dede Aan Septiantini A.Md.Kep'] },
  'Posbindu Sidamulih': { hari: 3, minggu_ke: 1, kelurahan: 'Mugarsari', petugas: ['Bdn. Nina Ainun,S.Tr.Keb'] },
  'Posbindu Sumelap': { hari: 1, minggu_ke: 2, kelurahan: 'Sumelap', petugas: ['Asri Awulan,S.Tr.Keb'] },
  'Posbindu Taman': { hari: 4, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Pia Nur Podiana,A.Md.Keb'] },
  'Posbindu Jatiwangi': { hari: 3, minggu_ke: 2, kelurahan: 'Mugarsari', petugas: ['Dewi Sri Mulyani,Am.Keb'] },
  'Posbindu Cipamutih': { hari: 3, minggu_ke: 2, kelurahan: 'Tamansari', petugas: ['Yesi Apriyani,Am.Keb'] },
  'Posbindu Nagarasari': { hari: 4, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Liska Permatasari,S.Kep.,Ners'] },
  'Posbindu Sukaasih': { hari: 0, minggu_ke: 3, kelurahan: 'Sumelap', petugas: ['Ucu Lestari,AM.Keb'] },
  'Posbindu Cidahu': { hari: 1, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Oriany Kemala Dewi,Amd.Kep'] },
  'Posbindu Perum Tamanjaya': { hari: 3, minggu_ke: 3, kelurahan: 'Tamanjaya', petugas: ['Liska Permatasari,S.Kep.,Ners'] },
  'Posbindu Sindangreret RW 05': { hari: 0, minggu_ke: 2, kelurahan: 'Tamanjaya', petugas: ['Alitsa Nuur Fithri,S.ST'] },
};

export const JADWAL_POS_REMAJA_FIXED: Record<string, {
  hari: number; minggu_ke: number; kelurahan: string; petugas: string[];
}> = {
  'Pos Yandu Remaja Kereta': { hari: 3, minggu_ke: 4, kelurahan: 'Tamanjaya', petugas: ['Endah Setiawati,S.Tr.Kes'] },
  'Pos Yandu Remaja Sakura': { hari: 4, minggu_ke: 4, kelurahan: 'Tamanjaya', petugas: ['Annisa Nafaulloh,S.Tr.Keb.,Bdn'] },
};

export const DAFTAR_UKK: { nama: string; kelurahan: string; petugas: string[] }[] = [
  { nama: 'CV. Katumbiri', kelurahan: 'Sumelap', petugas: ['Mira Jatnikawati,Am.Keb'] },
  { nama: 'Pasar Geger Noong', kelurahan: 'Tamanjaya', petugas: ['Mira Jatnikawati,Am.Keb'] },
];

export const DAFTAR_SEKOLAH_PESANTREN: string[] = [
  'Al-Ma\'muniyah', 'Al-Istiqomah', 'Al-Barokah', 'Raudlatutta\'allum',
  'Al-Ikhsan', 'Bustanul Ulum', 'Al-Furqon', 'Baetul Rohman',
  'Al-Muflih', 'Nurul Ihsan', 'Al-Falah', 'Babul Hikmah', 'Al-Huda',
  'Miftahul Ulum', 'Al-Musyri', 'Darul Ulum', 'Miftahul Anwar', 'Raudatul Ulum',
  'Al-Ihsan', 'Attaofiq', 'Al-Misbah', 'Miftahul Ulum Tamansari', 'Al-Mubarok',
  'Miftahussalam', 'Al-Muhtar', 'Al-Mubtadiin', 'Baitul Amanah', 'Sinargalih',
  'Al-Hikmah', 'Al-Ihsan Cipamutih', 'Miftahul Huda VII', 'Assarongki',
  'Miftahul Khoer Al-Musri II', 'Miftahul Ihsan', 'Al-Abror', 'Cilampahan',
];

export const WAJIB_SEKOLAH: string[] = ['drg.Rifan Hanggoro.M.M.R.S', 'Endah Setiawati,S.Tr.Kes', 'Annisa Fauziah,A.Md.Gz'];

// ─── INTERFACE KEGIATAN BOK ─────────────────────────────────────────────────
export interface KegiatanBOKConfig {
  freq: number;
  petugas: string[];
  penyerta: string[];
  allow_double_dalam?: boolean;
  allow_double_luar?: boolean;
  lokasi_fixed?: string;
  tanggal_fixed?: number;
  count_penyerta?: number;
  is_sekolah?: boolean;
  wajib?: string[];
  paket_dengan?: string;
}

// ─── KEGIATAN BOK ───────────────────────────────────────────────────────────
export const KEGIATAN_BOK: Record<string, KegiatanBOKConfig> = {
  'Pelacakan dan pengawasan minum obat untuk ODGJ Berat': {
    freq: 25,
    petugas: POOL_PETUGAS_DOKTER_GIGI,
    penyerta: POOL_PETUGAS_BIDAN_PERAWAT.filter(n => !['Mutia Wulansari.,S.Kep.,Ners', 'Ujang Effendi,S.Kep.,Ners', 'Haeriah,A.Md.Kep', 'Annisa Fauziah,A.Md.Gz'].includes(n)),
    allow_double_dalam: true,
    allow_double_luar: false,
  },
  'Pelacakan dan pelaporan kematian dan pelaksanaan otopsi verbal kematian Bayi/balita': {
    freq: 1, petugas: POOL_PETUGAS_DOKTER_GIGI, penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Pendampingan rujukan balita stunting/gizi buruk': {
    freq: 2, petugas: ['Annisa Fauziah, A.Md.Gz'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Sosialisasi Penyelenggaraan Imunisasi': {
    freq: 1, petugas: ['Pipit Puspitasari, Am.Keb'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
    lokasi_fixed: 'Tamansari', tanggal_fixed: 27,
  },
  'Deteksi dini dan cek kesehatan gratis di masyarakat': {
    freq: 14, petugas: POOL_PETUGAS_BIDAN_PERAWAT, penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    count_penyerta: 3, allow_double_dalam: false, allow_double_luar: false,
  },
  'Pemantauan dan tindak lanjut penyakit tidak menular': {
    freq: 20, petugas: POOL_PETUGAS_BIDAN_PERAWAT.slice(0, 17), penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Inspeksi Kesehatan Lingkungan (IKL) di sarana fasilitas umum': {
    freq: 10, petugas: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    penyerta: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Inspeksi Kesehatan Lingkungan di Sarana Tempat Pengolahan Pangan (TPP)': {
    freq: 10, petugas: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    penyerta: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Inspeksi Kesehatan Lingkungan di Sarana Air Minum': {
    freq: 10, petugas: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    penyerta: [...POOL_PETUGAS_SANITARIAN, ...POOL_PETUGAS_BIDAN_PERAWAT],
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM': {
    freq: 10, petugas: POOL_PETUGAS_STBM, penyerta: POOL_PETUGAS_STBM,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Monitoring Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM': {
    freq: 10, petugas: POOL_PETUGAS_STBM, penyerta: POOL_PETUGAS_STBM,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Verifikasi Pemberdayaan kader masyarakat melalui pemicuan untuk implementasi pilar 2-5 STBM': {
    freq: 14, petugas: POOL_PETUGAS_STBM, penyerta: POOL_PETUGAS_STBM,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Pemantauan minum obat dan terapi pencegahan TBC': {
    freq: 4, petugas: ['Mutia Wulansari.,S.Kep.,Ners'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Penemuan Kasus Aktif TB': {
    freq: 4, petugas: ['Mutia Wulansari.,S.Kep.,Ners'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Pelacakan Kasus Mangkir': {
    freq: 4, petugas: ['Mutia Wulansari.,S.Kep.,Ners'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Investigasi Kasus TB': {
    freq: 4, petugas: ['Mutia Wulansari.,S.Kep.,Ners'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Penemuan kasus dan deteksi dini pneumonia': {
    freq: 4, petugas: ['Pia Nur Podiana, A.Md.Keb'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Kunjungan ulang 60 hari AFP': {
    freq: 1, petugas: ['Iman Nurul Haq,A.Md.Kep'], penyerta: [],
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Penemuan dan tindak lanjut penyakit tropis terabaikan': {
    freq: 4, petugas: ['Mutia Wulansari.,S.Kep.,Ners'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Pemantauan bayi usia 9-12 bulan yang lahir dari ibu Hepatitis B': {
    freq: 1, petugas: ['Oriany Kemala Dewi, Amd.Kep'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Pemantauan status bayi dari ibu positif HIV/sifilis': {
    freq: 2, petugas: POOL_PETUGAS_BIDAN_PERAWAT.slice(0, 17), penyerta: POOL_PETUGAS_BIDAN_PERAWAT.slice(0, 17),
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Pemeriksaan Jentik Nyamuk (survei Vektor DBD)': {
    freq: 4, petugas: ['Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'PSN oleh kader G1R1J': {
    freq: 4, petugas: ['Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Larvasidasi DBD': {
    freq: 4, petugas: ['Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Pengasapan Atau Fogging Nyamuk': {
    freq: 2, petugas: ['Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    count_penyerta: 2, allow_double_dalam: true, allow_double_luar: false,
  },
  'Surveilans Kualitas Air Minum Rumah Tangga (KAMRT)': {
    freq: 30, petugas: ['Eko Wahyu Saputro, S.K.M', 'Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Penyelidikan Kasus Epidemiologi Penyakit Kasus Penyakit menular': {
    freq: 4, petugas: ['Iman Nurul Haq,A.Md.Kep'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Verifikasi Sinyal penyakit potensial wabah/KLB': {
    freq: 2, petugas: ['Iman Nurul Haq,A.Md.Kep', 'Nurul Hasanah, A.Md.KL'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Penyelidikan Epidimiologi Penyakit Arbovirosis': {
    freq: 4, petugas: ['Iman Nurul Haq,A.Md.Kep'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Penyelidikan Epidimiologi Penyakit Zoonosis': {
    freq: 2, petugas: ['Iman Nurul Haq,A.Md.Kep'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: true, allow_double_luar: false,
  },
  'Pendampingan pelaksanaan ILP di pustu dan Unit Pelayanan Kesehatan Desa/Kelurahan (UPKD/K)': {
    freq: 1, petugas: ['Rudi Sutikno, SKM'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
  },
  'Skrining Kesehatan di Sekolah': {
    freq: 4, petugas: WAJIB_SEKOLAH, penyerta: POOL_BIDAN,
    count_penyerta: 1, allow_double_dalam: false, allow_double_luar: false,
    is_sekolah: true, wajib: WAJIB_SEKOLAH,
  },
  'Pembinaan Kesehatan di Sekolah': {
    freq: 4, petugas: ['Rudi Sutikno, SKM'], penyerta: POOL_PETUGAS_BIDAN_PERAWAT,
    allow_double_dalam: false, allow_double_luar: false,
    is_sekolah: true, paket_dengan: 'Skrining Kesehatan di Sekolah',
  },
};

// ─── KEGIATAN POSYANDU/POSBINDU/UKK/POS REMAJA ──────────────────────────────
export const KEGIATAN_POSYANDU_LIST: [string, number][] = [
  ['Pelaksanaan Imunisasi Bayi dan baduta di posyandu', 8],
  ['Pelayanan Imunisasi Kejar', 8],
  ['Pelaksanaan Kelas Ibu Hamil', 4],
  ['Pelaksanaan Kelas Ibu Balita', 4],
  ['Pelaksanaan skrining dan intervensi hasil skrining masalah Kesehatan jiwa di UKBM/Lembaga', 20],
  ['Kunjungan Lapangan Bumil Masalah Gizi', 4],
  ['Kunjungan Lapangan Bayi Balita Masalah Gizi', 4],
];

export const KEGIATAN_POS_REMAJA_LIST: [string, number][] = [
  ['Pembinaan Kesehatan di Komunitas', 2],
];

// ─── ROLE MAPPING ───────────────────────────────────────────────────────────
export const ROLE_MAP: Record<string, string[]> = {
  'dokter': ['dr.', 'drg.'],
  'perawat_ners': ['Ners', 'S.Kep', 'Amd.Kep', 'A.Md.Kep'],
  'bidan': ['Bdn.', 'S.Tr.Keb', 'Am.Keb', 'A.Md.Keb'],
  'promkes': ['Promosi', 'SKM'],
  'sanitarian': ['Sanitarian', 'S.K.M', 'A.Md.KL'],
  'gizi': ['S.Gz', 'A.Md.Gz'],
  'apoteker': ['Apt', 'S.Farm'],
  'lab': ['A.Md.AK'],
  'gigi': ['drg.', 'S.Tr.Kes'],
  'administrasi': ['S.E', 'S.T', 'S.Kep', 'S.ST', 'SKM', 'AMd.RMIK'],
};

// ─── BULAN (untuk opsi select) ──────────────────────────────────────────────
export const BULAN_OPTIONS: string[] = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ─── HARI KERJA ─────────────────────────────────────────────────────────────
export const HARI_KERJA: string[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// ─── DAFTAR KEGIATAN BAKU ─────────────────────────────────────────────────────
export const DAFTAR_KEGIATAN_DALAM_GEDUNG: string[] = [
  'PENDAFTARAN',
  'SKRINING ILP 1',
  'SKRINING ILP 2',
  'POLI PROLANIS',
  'KLASTER DEWASA-LANSIA 1',
  'KLASTER DEWASA-LANSIA 2',
  'KLASTER IBU KIA & USG',
  'KLASTER ANAK',
  'R. IMUNISASI',
  'R. TINDAKAN',
  'BP GIGI',
  'APOTEK',
  'LAB',
  'R. TB',
  'ADMINISTRASI',
  'PIKET PERSALINAN PAGI',
  'PIKET PERSALINAN SORE',
  'PIKET PERSALINAN MALAM',
  'LIBUR PIKET PERSALINAN',
  'PELAYANAN PUSTU',
  'LOKA KARYA MINI BULANAN',
];

export const DAFTAR_KEGIATAN_LUAR_GEDUNG: string[] = [
  'CUTI- IZIN- SAKIT',
  'KELAS IBU HAMIL',
  'DETEKSI DINI DAN CEK KESEHATAN GRATIS DI MASYARAKAT',
  'INSPEKSI KESEHATAN LINGKUNGAN DI SARANA AIR MINUM',
  'INSPEKSI KESEHATAN LINGKUNGAN(IKL) DI SARANA FASILITAS UMUM',
  'INSPEKSI KESEHATAN LINGKUNGAN DI SARANA TEMPAT PENGOLAHAN PANGAN(TPP)',
  'RAPAT KTR',
  'RAPAT MONEV KEUANGAN',
  'PELAYANAN POSYANDU',
  'PELAKSANAAN SKRINING DAN INTERVENSI HASIL SKRINING MASALAH KESEHATAN JIWA DI UKBM/LEMBAGA',
  'KUNJUNGAN LAPANGAN BUMIL MASALAH GIZI',
  'KUNJUNGAN LAPANGAN BAYI BALITA MASALAH GIZI',
  'PENEMUAN DAN TINDAK LANJUT PENYAKIT TROPIS TERABAIKAN',
  'PELAYANAN IMUNISASI KEJAR',
  'PELAKSANAAN IMUNISASI BAYI DAN BADUTA DI POSYANDU',
  'PELAKSANAAN KELAS IBU HAMIL',
  'PELAKSANAAN KELAS IBU BALITA',
  'PELAKSANAAN POSBINDU',
  'PEMERIKSAAN BAYI BALITA DGN MASALAH GIZI KE DOKTER SPESIALIS ANAK',
  'PEMBINAAN KESEHATAN',
  'PEMBINAAN KESEHATAN DI KOMUNITAS',
  'PELACAKAN DAN PENGAWASAN MINUM OBAT UNTUK ODGJ BERAT',
  'PENYELDIKAN KASUS EPIDEMIOLOGI PENYAKIT KASUS PENYAKIT MENULAR',
  'PENEMUAN KASUS KIPI',
  'SWEEPING IMUNISASI',
  'SKRINING KESEHATAN',
  'SKRINING KESEHATAN DI SEKOLAH',
  'FASILITASI PELAKSANAAN FIRST AIDER PERTOLONGAN PERTAMA PADA LUKA PSIKOLOGIS(P3LP)',
  'LARVASIDASI DBD',
  'PEMERIKSAAN JENTIK NYAMUK(SURVEI VEKTOR DBD)',
  'PELAKSANAAN KELAS IBU BALITA',
  'PELACAKAN DAN PELAPORAN KEMATIAN DAN PELAKSANAAN OTOPSI VERBAL KEMATIAN BAYI/BALITA',
  'PENDAMPINGAN RUJUKAN BALITA STUNTING/GIZI BURUK',
  'SOSIALISASI PENYELENGGARAAN IMUNISASI',
  'PEMANTAUAN DAN TINDAK LANJUT PENYAKIT TIDAK MENULAR',
  'PEMBERDAYAAN KADER MASYARAKAT MELALUI PEMICUAN UNTUK IMPLEMENTASI PILAR 2-5 STBM',
  'MONITORING PEMBERDAYAAN KADER MASYARAKAT MELALUI PEMICUAN UNTUK IMPLEMENTASI PILAR 2-5 STBM',
  'VERIFIKASI PEMBERDAYAAN KADER MASYARAKAT MELALUI PEMICUAN UNTUK IMPLEMENTASI PILAR 2-5 STBM',
  'PEMANTAUAN MINUM OBAT DAN TERAPI PENCEGAHAN TBC',
  'PENEMUAN KASUS AKTIF TB',
  'PELACAKAN KASUS MANGKIR',
  'INVESTIGASI KASUS TB',
  'PENEMUAN KASUS DAN DETEKSI DINI PNEUMONIA',
  'KUNJUNGAN ULANG 60 HARI AFP',
  'PEMANTAUAN BAYI USIA 9-12 BULAN YANG LAHIR DARI IBU HEPATITIS B',
  'PEMANTAUAN STATUS BAYI DARI IBU POSITIF HIV/SIFILIS',
  'PSN OLEH KADER G1R1J',
  'PENGASAPAN ATAU FOGGING NYAMUK',
  'SURVEILANS KUALITAS AIR MINUM RUMAH TANGGA (KAMRT)',
  'VERIFIKASI SINYAL PENYAKIT POTENSIAL WABAH/KLB',
  'PENYELIDIKAN EPIDIMIOLOGI PENYAKIT ARBOVIROSIS',
  'PENYELIDIKAN EPIDIMIOLOGI PENYAKIT ZOONOSIS',
  'PENDAMPINGAN PELAKSANAAN ILP DI PUSTU DAN UNIT PELAYANAN KESEHATAN DESA/KELURAHAN (UPKD/K)',
];

// ─── DAFTAR LOKASI BAKU ──────────────────────────────────────────────────────
export const DAFTAR_LOKASI_DALAM_GEDUNG: string[] = [
  'Dalam Gedung',
  'Pustu Ciangir',
  'Pustu Sumelap',
];

export const DAFTAR_LOKASI_LUAR_GEDUNG: string[] = [
  'Posyandu Sumelap',
  'Posyandu Cieurih',
  'Posyandu Liunggunung',
  'Posyandu Kadupandak',
  'Posyandu Perum Puri Sumelap',
  'Posyandu Babakan Jati',
  'Posyandu Sukaasih',
  'Posyandu Perum Sukawening',
  'Posyandu Cigintung',
  'Posyandu Kubangsari',
  'Posyandu Malingping',
  'Posyandu Sindangreret',
  'Posyandu Karisma',
  'Posyandu Cibeureum',
  'Posyandu Nagarasari',
  'Posyandu Situdukun',
  'Posyandu Gegernoong',
  'Posyandu Taman',
  'Posyandu Harapan Bunda',
  'Posyandu Kasih Bunda',
  'Posyandu Cidahu',
  'Posyandu Perum Nusa Indah',
  'Posyandu Bantarsari',
  'Posyandu Selaawi',
  'Posyandu Sidamulih',
  'Posyandu Bbk.Cipasung',
  'Posyandu Nangela',
  'Posyandu Jatiwangi',
  'Posyandu Cipasung',
  'Posyandu Kubang',
  'Posyandu Nyantong',
  'Posyandu Sinargalih',
  'Posyandu Ciatal',
  'Posyandu Bandung',
  'Posyandu Cipajaran',
  'Posyandu Situhiang',
  'Posyandu Ciledug',
  'Posyandu Selakaso',
  'Posyandu Cipamutih',
  'Posyandu Sangkali',
  'Posyandu Ciangir',
  'Posyandu Cipangebak',
  'Posbindu Cigintung',
  'Posbindu Sindangreret',
  'Posbindu Sidamulih',
  'Posbindu Sumelap',
  'Posbindu Taman',
  'Posbindu Jatiwangi',
  'Posbindu Cipamutih',
  'Posbindu Nagarasari',
  'Posbindu Sukaasih',
  'Posbindu Cidahu',
  'Posbindu Perum Tamanjaya',
  'Posbindu Sindangreret Rw 05',
  'Posbindu Cibeureum',
  'Pos Yandu Remaja Kereta',
  'Pos Yandu Remaja Sakura',
  'CV. Katumbiri',
  'Pasar Geger Noong',
  'SMP Bustanul Ulum',
  'MI dan MTS Al Hidayah',
  'Pesantren Al-Ma\'muniyyah',
  'Pesantren Al-Istiqomah',
  'Pesantren Al-Barokah',
  'Pesantren Raudlatutta\'allum',
  'Pesantren Al-Ikhsan',
  'Pesantren Bustanul Ulum',
  'Pesantren Al-Furqon',
  'Pesantren Baetul Rohman',
  'Pesantren Al-Muflih',
  'Pesantren Nurul Ihsan',
  'Pesantren Al-Falah',
  'Pesantren Babul Hikmah',
  'Pesantren Al-Huda',
  'Pesantren Miftahul Ulum Mugarsari',
  'Pesantren Al-Musyri',
  'Pesantren Darul Ulum',
  'Pesantren Miftahul Anwar',
  'Pesantren Raudatul Ulum',
  'Pesantren Al-Ihsan Tamansari',
  'Pesantren Attaofiq',
  'Pesantren Al-Misbah',
  'Pesantren Miftahul Ulum Tamansari',
  'Pesantren Al-Mubarok',
  'Pesantren Miftahussalam',
  'Pesantren Al-Muhtar',
  'Pesantren Al-Mubtadiin',
  'Pesantren Baitul Amanah',
  'Pesantren Sinargalih',
  'Pesantren Al-Hikmah',
  'Pesantren Al-Ihsan Cipamutih',
  'Pesantren Miftahul Huda VII',
  'Pesantren Assarongki',
  'Pesantren Miftahul Khoer Al-Musri II',
  'Pesantren Miftahul Ihsan',
  'Pesantren Al-Abror',
  'Pesantren Cilampahan',
  'Ruang Rapat',
  'Sarana Air Minum',
  'Sarana Fasilitas Umum',
  'Sarana Tempat Pengolahan Pangan(TPP)',
  'Lapangan',
  'UKBM/Lembaga',
  'Tamanjaya',
  'Tamansari',
  'Sumelap',
  'Mugarsari',
];