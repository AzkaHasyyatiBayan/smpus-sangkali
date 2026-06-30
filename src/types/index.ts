export interface Kegiatan {
  id: number;
  tanggal: string;
  lokasi: string;
  kegiatan: string;
  penyerta: string;
  kategori: 'dalam_gedung' | 'luar_gedung';
  sub_kategori?: string;
  is_auto_generated?: boolean;
  source?: 'google_sheet' | 'manual' | 'randomize';
}

export interface HariLibur {
  id: number;
  tanggal: string;
  keterangan: string;
  jenis: 'nasional' | 'cuti_bersama' | 'custom';
}