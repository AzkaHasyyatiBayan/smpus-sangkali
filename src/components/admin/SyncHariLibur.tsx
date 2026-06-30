'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { CalendarSync, RefreshCw } from 'lucide-react';

export default function SyncHariLibur() {
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await apiPost('sync-hari-libur-api/', { tahun }, token ?? '');
      
      if (res.status === 200) {
        const data = res.data as { message?: string; created?: number; skipped?: number };
        toast.success(`${data.message} (${data.created} baru, ${data.skipped} dilewati)`);
      } else {
        toast.error('Gagal sync hari libur');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center shrink-0">
          <CalendarSync size={22} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-puskesmas-900">Sync Hari Libur Nasional</h3>
          <p className="text-sm text-gray-500 mt-1">
            Tarik data hari libur dari API eksternal (Nager.Date)
          </p>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
            Tahun
          </label>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(parseInt(e.target.value))}
            className="block w-32 rounded-xl border border-gray-200 px-3 py-2.5"
          />
        </div>
        <Button
          onClick={handleSync}
          loading={loading}
          className="rounded-xl px-6 bg-linear-to-r from-blue-600 to-cyan-600!"
        >
          <RefreshCw size={16} className="inline mr-2" /> Sync Hari Libur
        </Button>
      </div>
    </div>
  );
}