import { useState } from 'react';
import { apiGet } from '@/lib/api';
import { DAFTAR_NAMA } from '@/lib/constans';
import { bulanOptions, formatTanggal } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Kegiatan } from '@/types';
import { History, MapPin, Calendar, CheckCircle2, XCircle, Circle, Inbox, Loader2 } from 'lucide-react';

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

export default function RiwayatKehadiran() {
  const [nama, setNama] = useState(DAFTAR_NAMA[0]);
  const [bulan, setBulan] = useState('Semua');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [data, setData] = useState<Kegiatan[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRiwayat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet('search-user/', { penyerta: nama }) as Kegiatan[];
      
      console.log('[RiwayatKehadiran] Response:', res?.length);
      console.log('[RiwayatKehadiran] Nama dicari:', nama, '→ normalized:', normalizeName(nama));
      console.log('[RiwayatKehadiran] Sample penyerta:', res?.[0]?.penyerta, '→ normalized:', res?.[0]?.penyerta?.split(';').map(n => normalizeName(n)));
      
      let filtered: Kegiatan[] = (res || []).filter(item => matchesName(item.penyerta, nama));
      
      console.log('[RiwayatKehadiran] After name filter:', filtered.length);
      
      if (bulan !== 'Semua') {
        const monthIdx = bulanOptions.indexOf(bulan);
        filtered = filtered.filter(item => new Date(item.tanggal).getMonth() === monthIdx);
      }
      filtered = filtered.filter(item => new Date(item.tanggal).getFullYear() === tahun);
      filtered.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      
      console.log('[RiwayatKehadiran] Final filtered:', filtered.length);
      setData(filtered);
      setHasSearched(true);
    } catch (err) {
      console.error('[RiwayatKehadiran] Gagal mengambil riwayat:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setData([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (key: string, status: string) => {
    setStatusMap(prev => ({ ...prev, [key]: status }));
  };

  const statusIcon = (status: string) => {
    if (status === 'hadir') return <CheckCircle2 size={14} className="text-green-500" />;
    if (status === 'tidak_hadir') return <XCircle size={14} className="text-red-500" />;
    return <Circle size={14} className="text-gray-300" />;
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-puskesmas-900 mb-5 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
          <History size={18} className="text-puskesmas-600" />
        </div>
        Riwayat Kehadiran Saya
      </h3>

      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[160px]">
            <Select label="Nama" value={nama} onChange={e => setNama(e.target.value)} options={DAFTAR_NAMA} />
          </div>
          <div className="min-w-[140px]">
            <Select label="Bulan" value={bulan} onChange={e => setBulan(e.target.value)} options={['Semua', ...bulanOptions]} />
          </div>
          <div className="min-w-[100px]">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="text-puskesmas-500" /> Tahun
            </label>
            <input
              type="number"
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
            />
          </div>
          <Button 
            onClick={fetchRiwayat} 
            disabled={loading}
            className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <><Loader2 size={16} className="inline mr-1.5 animate-spin" /> Memuat...</>
            ) : (
              'Tampilkan'
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={32} className="mx-auto mb-3 text-puskesmas-500 animate-spin" />
          <p className="text-gray-500 text-sm">Memuat riwayat kehadiran...</p>
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item, idx) => {
            const key = `${item.tanggal}|${item.kegiatan}|${item.lokasi}`;
            const isPast = new Date(item.tanggal) <= new Date();
            const status = statusMap[key] || 'belum';
            return (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    status === 'hadir' ? 'bg-green-500/10' :
                    status === 'tidak_hadir' ? 'bg-red-500/10' :
                    'bg-gray-100'
                  }`}>
                    {statusIcon(status)}
                  </div>
                  <div>
                    <strong className="text-puskesmas-900 font-bold block">{item.kegiatan}</strong>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                      <Calendar size={12} />
                      <span>{formatTanggal(item.tanggal)}</span>
                      <span className="text-gray-300">•</span>
                      <MapPin size={12} />
                      <span>{item.lokasi}</span>
                    </div>
                    <div className="text-xs mt-1 font-medium">
                      {status === 'hadir' ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Hadir</span> :
                       status === 'tidak_hadir' ? <span className="text-red-600 flex items-center gap-1"><XCircle size={12} /> Tidak Hadir</span> :
                       <span className="text-gray-400 flex items-center gap-1"><Circle size={12} /> Belum Ditandai</span>}
                    </div>
                  </div>
                </div>
                {isPast && (
                  <div className="flex gap-2 sm:shrink-0">
                    <Button
                      variant={status === 'hadir' ? 'primary' : 'secondary'}
                      onClick={() => toggleStatus(key, 'hadir')}
                      className="rounded-lg text-xs px-3 py-1.5 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <CheckCircle2 size={13} className="inline mr-1" /> Hadir
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => toggleStatus(key, 'tidak_hadir')}
                      className="rounded-lg text-xs px-3 py-1.5 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <XCircle size={13} className="inline mr-1" /> Tidak
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-gray-200">
          <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Tidak ada riwayat kegiatan</p>
          <p className="text-gray-400 text-sm mt-1">untuk <strong>{nama}</strong> pada periode ini</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-gray-200">
          <History size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Belum ada data yang ditampilkan</p>
          <p className="text-gray-400 text-sm mt-1">Klik <strong>Tampilkan</strong> untuk melihat riwayat</p>
        </div>
      )}
    </div>
  );
}