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

// ─── ROLE MAPPING UNTUK FILTER DAN RANDOMIZE ────────────────────────────────
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

// ─── HARI KERJA (untuk randomize) ───────────────────────────────────────────
export const HARI_KERJA: string[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// ─── DAFTAR KEGIATAN BAKU (dari template jadwal) ─────────────────────────────
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
  // Posyandu - SUMELAP
  'Posyandu Sumelap',
  'Posyandu Cieurih',
  'Posyandu Liunggunung',
  'Posyandu Kadupandak',
  'Posyandu Perum Puri Sumelap',
  'Posyandu Babakan Jati',
  'Posyandu Sukaasih',
  'Posyandu Perum Sukawening',
  'Posyandu Cigintung',
  
  // Posyandu - TAMANJAYA
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
  
  // Posyandu - MUGARSARI
  'Posyandu Selaawi',
  'Posyandu Sidamulih',
  'Posyandu Bbk.Cipasung',
  'Posyandu Nangela',
  'Posyandu Jatiwangi',
  'Posyandu Cipasung',
  'Posyandu Kubang',
  'Posyandu Nyantong',
  
  // Posyandu - TAMANSARI
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
  
  // Posbindu
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
  
  // Pos Remaja
  'Pos Yandu Remaja Kereta',
  'Pos Yandu Remaja Sakura',
  
  // UKK
  'CV. Katumbiri',
  'Pasar Geger Noong',
  
  // Sekolah
  'SMP Bustanul Ulum',
  'MI dan MTS Al Hidayah',
  
  // Pesantren - Tamanjaya
  'Pesantren Al-Ma\'muniyyah',
  'Pesantren Al-Istiqomah',
  'Pesantren Al-Barokah',
  'Pesantren Raudlatutta\'allum',
  
  // Pesantren - Sumelap
  'Pesantren Al-Ikhsan',
  'Pesantren Bustanul Ulum',
  'Pesantren Al-Furqon',
  'Pesantren Baetul Rohman',
  'Pesantren Al-Muflih',
  'Pesantren Nurul Ihsan',
  'Pesantren Al-Falah',
  'Pesantren Babul Hikmah',
  'Pesantren Al-Huda',
  
  // Pesantren - Mugarsari
  'Pesantren Miftahul Ulum Mugarsari',
  'Pesantren Al-Musyri',
  'Pesantren Darul Ulum',
  'Pesantren Miftahul Anwar',
  'Pesantren Raudatul Ulum',
  
  // Pesantren - Tamansari
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
  
  // Lokasi Lainnya
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