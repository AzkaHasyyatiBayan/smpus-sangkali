'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Receipt from '@/components/ui/Receipt';
import toast from 'react-hot-toast';
import { Kegiatan } from '@/types';
import { Search, Calendar } from 'lucide-react';

export default function SearchForm() {
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [penyerta, setPenyerta] = useState('');
  const [hasil, setHasil] = useState<Kegiatan[]>([]);
  
  // Data untuk dropdown autocomplete
  const [lokasiOptions, setLokasiOptions] = useState<string[]>([]);
  const [kegiatanOptions, setKegiatanOptions] = useState<string[]>([]);
  const [penyertaOptions, setPenyertaOptions] = useState<string[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Fetch data untuk dropdown
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiGet('kegiatan/', {}, token);
        const data = res as Kegiatan[];
        
        // Extract unique values
        const uniqueLokasi = [...new Set(data.map(d => d.lokasi).filter(Boolean))];
        const uniqueKegiatan = [...new Set(data.map(d => d.kegiatan).filter(Boolean))];
        const uniquePenyerta = [...new Set(
          data.flatMap(d => d.penyerta.split(';').map(p => p.trim()).filter(Boolean))
        )];
        
        setLokasiOptions(uniqueLokasi.sort());
        setKegiatanOptions(uniqueKegiatan.sort());
        setPenyertaOptions(uniquePenyerta.sort());
      } catch {
        // Silent fail
      }
    })();
  }, [token]);

  const handleSearch = async () => {
    const params: Record<string, string> = {};
    if (tanggal) params.tanggal = tanggal;
    if (lokasi) params.lokasi = lokasi;
    if (kegiatan) params.kegiatan = kegiatan;
    if (penyerta) params.penyerta = penyerta;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Harap login terlebih dahulu');
      return;
    }
    try {
      const data = await apiGet('search-admin/', params, token);
      setHasil(data as Kegiatan[]);
    } catch {
      toast.error('Gagal mencari data');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <h3 className="text-lg font-bold text-puskesmas-900 mb-5 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
          <Search size={18} className="text-puskesmas-600" />
        </div>
        Pencarian Admin
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            <Calendar size={14} className="text-puskesmas-500" /> Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="mt-0 block w-full rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
          />
        </div>
        <div>
          <Input 
            label="Lokasi" 
            value={lokasi} 
            onChange={(e) => setLokasi(e.target.value)}
            list="lokasi-list"
            placeholder="Ketik atau pilih..."
          />
          <datalist id="lokasi-list">
            {lokasiOptions.map((opt, idx) => (
              <option key={idx} value={opt} />
            ))}
          </datalist>
        </div>
        <div>
          <Input 
            label="Kegiatan" 
            value={kegiatan} 
            onChange={(e) => setKegiatan(e.target.value)}
            list="kegiatan-list"
            placeholder="Ketik atau pilih..."
          />
          <datalist id="kegiatan-list">
            {kegiatanOptions.map((opt, idx) => (
              <option key={idx} value={opt} />
            ))}
          </datalist>
        </div>
        <div>
          <Input 
            label="Penyerta" 
            value={penyerta} 
            onChange={(e) => setPenyerta(e.target.value)}
            list="penyerta-list"
            placeholder="Ketik atau pilih..."
          />
          <datalist id="penyerta-list">
            {penyertaOptions.map((opt, idx) => (
              <option key={idx} value={opt} />
            ))}
          </datalist>
        </div>
      </div>
      <Button onClick={handleSearch} className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        <Search size={16} className="inline mr-1.5" /> Cari
      </Button>

      {hasil.length > 0 && (
        <div className="mt-6 animate-fade-in">
          <Receipt title="Hasil Pencarian" items={hasil.map(h => ({
            tanggal: h.tanggal,
            lokasi: h.lokasi,
            kegiatan: h.kegiatan,
            penyerta: h.penyerta,
          }))} />
        </div>
      )}
    </div>
  );
}