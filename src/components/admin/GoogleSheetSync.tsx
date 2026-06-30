'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { FileSpreadsheet, RefreshCw, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface SyncResponse {
  message?: string;
  error?: string;
}

export default function GoogleSheetSync() {
  const [csvUrl, setCsvUrl] = useState('');
  const [mode, setMode] = useState('append');
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
      const resData = res.data as SyncResponse;
      if (res.status === 200) {
        toast.success(resData?.message || 'Sync berhasil');
      } else {
        toast.error(resData?.error || 'Gagal sync');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center shrink-0">
          <FileSpreadsheet size={22} className="text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-puskesmas-900">Sync Google Spreadsheet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Kolom yang dibutuhkan: <strong className="text-puskesmas-700">tanggal</strong>, <strong className="text-puskesmas-700">lokasi</strong>, <strong className="text-puskesmas-700">kegiatan</strong>, <strong className="text-puskesmas-700">penyerta</strong>.
          </p>
        </div>
      </div>

      {/* Input */}
      <div>
        <Input 
          label="Link CSV terpublikasi Google Sheet" 
          value={csvUrl} 
          onChange={(e) => setCsvUrl(e.target.value)} 
          placeholder="https://docs.google.com/spreadsheets/d/..." 
        />
      </div>

      {/* Mode Selection - Compact */}
      <div className="space-y-3 space-x-3">
        <label className="text-sm font-semibold text-gray-700">Mode Sinkronisasi</label>
        <div className="inline-flex gap-3 p-2 bg-gray-100 rounded-xl">
          <label 
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300
              ${mode === 'append' 
                ? 'bg-white shadow-sm text-green-700 font-semibold' 
                : 'text-gray-600 hover:text-gray-800'}
            `}
          >
            <input 
              type="radio" 
              name="syncMode" 
              value="append" 
              checked={mode === 'append'} 
              onChange={() => setMode('append')} 
              className="hidden"
            />
            <CheckCircle2 size={16} className={mode === 'append' ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-sm">Tambahkan</span>
          </label>

          <label 
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300
              ${mode === 'replace' 
                ? 'bg-white shadow-sm text-red-700 font-semibold' 
                : 'text-gray-600 hover:text-gray-800'}
            `}
          >
            <input 
              type="radio" 
              name="syncMode" 
              value="replace" 
              checked={mode === 'replace'} 
              onChange={() => setMode('replace')} 
              className="hidden"
            />
            <AlertCircle size={16} className={mode === 'replace' ? 'text-red-600' : 'text-gray-400'} />
            <span className="text-sm">Ganti Semua</span>
          </label>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={handleSync} 
        loading={loading}
        className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <RefreshCw size={16} className="inline mr-2" /> Sync Sekarang
      </Button>

      {/* Info Box */}
      <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-200/50 rounded-xl text-xs text-blue-700">
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong>Cara mendapatkan link CSV:</strong> Buka Google Sheet → File → Share → Publish to web → Format CSV → Salin link
        </div>
      </div>
    </div>
  );
}