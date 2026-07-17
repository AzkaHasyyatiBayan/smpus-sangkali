'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { FileSpreadsheet, RefreshCw, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface SyncResponse {
  message?: string;
  error?: string;
  peringatan?: string[];
}

export default function GoogleSheetSync() {
  const [csvUrl, setCsvUrl] = useState('');
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    if (!csvUrl) {
      toast.error('Masukkan link CSV terlebih dahulu');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await apiPost('sync-sheets/', { csv_url: csvUrl, mode }, token ?? '');
      const data = res.data as SyncResponse;
      
      if (res.status === 200) {
        toast.success(data.message || 'Sync berhasil');
        if (data.peringatan?.length) {
          toast.error(data.peringatan[0], { duration: 6000 });
        }
      } else {
        toast.error(data.error || 'Gagal sync');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center shrink-0">
          <FileSpreadsheet size={22} className="text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-puskesmas-900">Sync Google Spreadsheet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Kolom yang dibutuhkan: <strong>tanggal</strong> (format <strong>DD/MM/YYYY</strong>), 
            <strong>lokasi</strong>, <strong>kegiatan</strong>, <strong>penyerta</strong>.
          </p>
        </div>
      </div>

      <Input 
        label="Link CSV terpublikasi Google Sheet" 
        value={csvUrl} 
        onChange={(e) => setCsvUrl(e.target.value)} 
        placeholder="https://docs.google.com/spreadsheets/d/..." 
      />

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Mode Sinkronisasi</label>
        <div className="inline-flex gap-3 p-2 bg-gray-100 rounded-xl">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${mode === 'append' ? 'bg-white shadow-sm text-green-700 font-semibold' : 'text-gray-600 hover:text-gray-800'}`}>
            <input type="radio" checked={mode === 'append'} onChange={() => setMode('append')} className="hidden" />
            <CheckCircle2 size={16} className={mode === 'append' ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-sm">Tambahkan</span>
          </label>

          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${mode === 'replace' ? 'bg-white shadow-sm text-red-700 font-semibold' : 'text-gray-600 hover:text-gray-800'}`}>
            <input type="radio" checked={mode === 'replace'} onChange={() => setMode('replace')} className="hidden" />
            <AlertCircle size={16} className={mode === 'replace' ? 'text-red-600' : 'text-gray-400'} />
            <span className="text-sm">Ganti Semua</span>
          </label>
        </div>
      </div>

      <Button onClick={handleSync} loading={loading} className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
        <RefreshCw size={16} className="inline mr-2" /> Sync Sekarang
      </Button>

      <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-200/50 rounded-xl text-xs text-blue-700">
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong>Format tanggal yang disarankan:</strong> DD/MM/YYYY (contoh: 03/02/2026 = 3 Februari 2026)
        </div>
      </div>
    </div>
  );
}