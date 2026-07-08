import { useState } from 'react';
import { apiGet } from '@/lib/api';
import { DAFTAR_NAMA } from '@/lib/constans';
import Receipt from '@/components/ui/Receipt';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { formatTanggal } from '@/lib/utils';
import { Kegiatan } from '@/types';
import { Search, Calendar, Inbox, Loader2 } from 'lucide-react';

// ============================================
// FUNGSI FORMAT TANGGAL KE DD/MM/YYYY
// ============================================
const formatTanggalKeAPI = (tanggalISO: string): string => {
  if (!tanggalISO) return '';
  const parts = tanggalISO.split('-');
  const tahun = parts[0];
  const bulan = parts[1];
  const hari = parts[2];
  return `${hari}/${bulan}/${tahun}`; // DD/MM/YYYY
};
// ============================================

// Menghapus spasi di sekitar koma dan menormalisasi spasi ganda
const normalizeName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s*,\s*/g, ',')   // Hapus spasi di sekitar koma: "A, B" → "A,B"
    .replace(/\s+/g, ' ')        // Normalisasi multiple spaces jadi satu
    .trim();
};

const matchesName = (penyerta: string, nama: string): boolean => {
  if (!penyerta || !nama) return false;
  const names = penyerta.split(';').map(n => normalizeName(n));
  const targetNama = normalizeName(nama);
  return names.some(n => n === targetNama);
};

export default function JadwalSearch() {
  const [nama, setNama] = useState(DAFTAR_NAMA[0]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0,10));
  const [hasil, setHasil] = useState<Kegiatan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Format ke DD/MM/YYYY (sesuai permintaan atasan)
      const tanggalBaru = formatTanggalKeAPI(tanggal);
      
      console.log('📅 Tanggal asli (dari input):', tanggal);
      console.log('📅 Tanggal dikirim ke API (DD/MM/YYYY):', tanggalBaru);
      
      // ===== PAKAI ENDPOINT PROXY JADWAL-SEARCH =====
      // Proxy ini akan mengubah DD/MM/YYYY → YYYY-MM-DD sebelum kirim ke Railway
      const data = await apiGet('jadwal-search/', { 
        penyerta: nama, 
        tanggal: tanggalBaru
      }) as Kegiatan[];
      // ==============================================
      
      // Filter client-side berdasarkan nama yang dinormalisasi
      const filtered = (data || []).filter(item => matchesName(item.penyerta, nama));
      
      console.log('[JadwalSearch] Response:', data?.length, 'Filtered:', filtered.length);
      console.log('[JadwalSearch] Sample data:', data?.[0]);
      console.log('[JadwalSearch] Nama dicari:', nama, '→ normalized:', normalizeName(nama));
      
      setHasil(filtered);
    } catch (err) {
      console.error('[JadwalSearch] Gagal mengambil data jadwal:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setHasil([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <h3 className="text-xl font-bold text-puskesmas-900 mb-5 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
          <Search size={18} className="text-puskesmas-600" />
        </div>
        Cari Jadwal Kegiatan
      </h3>
      
      <div className="flex gap-4 mb-5 flex-wrap items-end">
        <div className="flex-1 min-w-[180px]">
          <Select label="Nama" value={nama} onChange={e => setNama(e.target.value)} options={DAFTAR_NAMA} />
        </div>
        <div className="min-w-[180px]">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            <Calendar size={14} className="text-puskesmas-500" /> Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            className="mt-0 block w-full rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading}
          className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <><Loader2 size={16} className="inline mr-1.5 animate-spin" /> Mencari...</>
          ) : (
            <><Search size={16} className="inline mr-1.5" /> Cari</>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {hasil && !loading && (
        <div className="animate-fade-in">
          {hasil.length > 0 ? (
            <Receipt title="Jadwal Kegiatan" subtitle={formatTanggal(tanggal)} items={hasil} />
          ) : (
            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">Tidak ada kegiatan</p>
              <p className="text-gray-400 text-sm mt-1">
                untuk <strong>{nama}</strong> pada tanggal <strong>{formatTanggal(tanggal)}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-10">
          <Loader2 size={32} className="mx-auto mb-3 text-puskesmas-500 animate-spin" />
          <p className="text-gray-500 text-sm">Mencari jadwal kegiatan...</p>
        </div>
      )}
    </div>
  );
}