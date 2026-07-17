import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import Header from '@/components/layout/Header';
import JadwalSearch from '@/components/user/JadwalSearch';
import RiwayatKehadiran from '@/components/user/RiwayatKehadiran';
import JadwalTerdekat from '@/components/user/JadwalTerdekat';
import { Bell, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { Kegiatan } from '@/types';

function getInitialDates() {
  const now = new Date();
  return {
    today: now.toISOString().slice(0, 10),
    tomorrow: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
  };
}

export default function HomePage() {
  const [notifHariIni, setNotifHariIni] = useState<Kegiatan[]>([]);
  const [notifBesok, setNotifBesok] = useState<Kegiatan[]>([]);
  const [{ today, tomorrow }] = useState(getInitialDates);

  useEffect(() => {
    apiGet('jadwal-terdekat/')
      .then(data => {
        const jadwal = data as Kegiatan[];
        setNotifHariIni(jadwal.filter(j => j.tanggal === today));
        setNotifBesok(jadwal.filter(j => j.tanggal === tomorrow));
      })
      .catch(() => {});
  }, [today, tomorrow]);

  return (
    <div>
      <main className="w-full px-4 py-8 max-w-6xl mx-auto">
        <Header
          title="Puskesmas Sangkali"
          subtitle="Sistem Informasi Manajemen Kegiatan"
          slides={['/images/slide1.jpg', '/images/slide2.jpg', '/images/slide3.jpg']}
        />

        {/* Papan Pengumuman - di atas */}
        {(notifHariIni.length > 0 || notifBesok.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {notifHariIni.length > 0 && (
              <div className="animate-fadeInUp delay-100 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="flex items-center gap-3 text-green-800 font-bold mb-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Bell size={18} className="text-green-600" />
                  </div>
                  <span>Kegiatan Hari Ini</span>
                  <span className="ml-auto text-xs bg-green-500 text-white px-2.5 py-0.5 rounded-full font-bold">{notifHariIni.length}</span>
                </div>
                <ul className="text-sm space-y-1.5">
                  {notifHariIni.slice(0, 6).map((j, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <span><strong className="text-green-900">{j.kegiatan}</strong> — {j.lokasi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {notifBesok.length > 0 && (
              <div className="animate-fadeInUp delay-200 bg-linear-to-br from-blue-50 to-sky-50 border border-blue-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="flex items-center gap-3 text-blue-800 font-bold mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle size={18} className="text-blue-600" />
                  </div>
                  <span>Kegiatan Besok</span>
                  <span className="ml-auto text-xs bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-bold">{notifBesok.length}</span>
                </div>
                <ul className="text-sm space-y-1.5">
                  {notifBesok.slice(0, 6).map((j, i) => (
                    <li key={i} className="flex items-start gap-2 text-blue-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span><strong className="text-blue-900">{j.kegiatan}</strong> — {j.lokasi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Search Jadwal + Informasi Penting - sejajar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {/* Search Jadwal - 3/5 width */}
          <div className="lg:col-span-3 animate-fadeInUp delay-300">
            <JadwalSearch />
          </div>

          {/* Informasi Penting - 2/5 width */}
          <div className="lg:col-span-2 animate-fadeInUp delay-400">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group h-full">
              <h3 className="font-bold text-puskesmas-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-puskesmas-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Info size={16} className="text-puskesmas-600" />
                </div>
                Informasi Penting
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {['Datang 15 menit lebih awal', 'Bawa KMS / BPJS', 'Gunakan masker'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Sparkles size={14} className="text-puskesmas-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Riwayat Kehadiran - full width di bawah */}
        <div className="mb-6 animate-fadeInUp delay-500">
          <RiwayatKehadiran />
        </div>

        {/* Jadwal Terdekat - paling bawah */}
        <div className="animate-fadeInUp delay-600">
          <JadwalTerdekat />
        </div>
      </main>
    </div>
  );
}