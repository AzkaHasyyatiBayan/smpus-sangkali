import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { Kegiatan } from '@/types';
import { CalendarDays, Inbox, Loader2 } from 'lucide-react';

export default function JadwalTerdekat() {
  const [jadwal, setJadwal] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('jadwal-terdekat/')
      .then(data => setJadwal(data as Kegiatan[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Helper: split penyerta dan tampilkan vertikal
  const renderPenyerta = (penyerta: string) => {
    if (!penyerta) return '-';
    const names = penyerta.split(';').map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return '-';
    
    return (
      <div className="flex flex-col gap-0.5">
        {names.map((name, idx) => (
          <span key={idx} className="text-gray-600 text-xs">
            {name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-puskesmas-900 mb-5 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
          <CalendarDays size={18} className="text-puskesmas-600" />
        </div>
        Jadwal Terdekat
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span className="text-sm">Memuat jadwal...</span>
        </div>
      ) : jadwal.length === 0 ? (
        <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-gray-200">
          <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Belum ada jadwal terdekat.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Kegiatan
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Lokasi
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]">
                  Penyerta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jadwal.map((j, i) => (
                <tr key={i} className="hover:bg-puskesmas-50/30 transition-colors duration-200 align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-medium align-top">
                    {new Date(j.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-puskesmas-900 font-semibold align-top">
                    {j.kegiatan}
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-top">
                    {j.lokasi}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {renderPenyerta(j.penyerta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}