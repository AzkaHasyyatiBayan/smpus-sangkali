'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';
import {
  DAFTAR_NAMA,
  DAFTAR_KEGIATAN_DALAM_GEDUNG,
  DAFTAR_KEGIATAN_LUAR_GEDUNG,
  DAFTAR_LOKASI_DALAM_GEDUNG,
  DAFTAR_LOKASI_LUAR_GEDUNG,
} from '@/lib/constans';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Calendar, Activity, Users, Save, X, ChevronDown } from 'lucide-react';

interface KegiatanResponse {
  error?: string;
  message?: string;
}

export default function InputKegiatanForm() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? undefined : undefined;

  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [lokasi, setLokasi] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [kategori, setKategori] = useState('dalam_gedung');
  const [subKategori, setSubKategori] = useState('lainnya');

  // Multi-select untuk penyerta
  const [selectedPenyerta, setSelectedPenyerta] = useState<string[]>([]);
  const [searchPenyerta, setSearchPenyerta] = useState('');
  const [showPenyertaDropdown, setShowPenyertaDropdown] = useState(false);

  // Pilihan kegiatan & lokasi berdasarkan kategori
  const daftarKegiatan = kategori === 'dalam_gedung'
    ? DAFTAR_KEGIATAN_DALAM_GEDUNG
    : DAFTAR_KEGIATAN_LUAR_GEDUNG;

  const daftarLokasi = kategori === 'dalam_gedung'
    ? DAFTAR_LOKASI_DALAM_GEDUNG
    : DAFTAR_LOKASI_LUAR_GEDUNG;

  // Reset lokasi, kegiatan, & subKategori saat kategori berubah
  const handleKategoriChange = (newKategori: string) => {
    setKategori(newKategori);
    setLokasi('');
    setKegiatan('');
    setSubKategori('lainnya');
  };

  // Filter nama untuk dropdown penyerta
  const filteredPenyerta = DAFTAR_NAMA.filter(name =>
    name.toLowerCase().includes(searchPenyerta.toLowerCase()) &&
    !selectedPenyerta.includes(name)
  );

  const addPenyerta = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selectedPenyerta.includes(trimmed)) {
      setSelectedPenyerta([...selectedPenyerta, trimmed]);
    }
    setSearchPenyerta('');
  };

  const removePenyerta = (name: string) => {
    setSelectedPenyerta(selectedPenyerta.filter(n => n !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasi || !kegiatan) {
      toast.error('Lokasi dan Kegiatan wajib diisi');
      return;
    }
    if (selectedPenyerta.length === 0) {
      toast.error('Minimal 1 penyerta harus dipilih');
      return;
    }
    const penyertaValue = selectedPenyerta.join('; ');

    const res = await apiPost('kegiatan/', {
      tanggal,
      lokasi,
      kegiatan,
      penyerta: penyertaValue,
      kategori,
      sub_kategori: kategori === 'luar_gedung' ? subKategori : '',
    }, token ?? '');

    const resData = res.data as KegiatanResponse;
    if (res.status === 201) {
      toast.success('Data berhasil disimpan!');
      setLokasi('');
      setKegiatan('');
      setSelectedPenyerta([]);
      setSubKategori('lainnya');
    } else {
      toast.error(resData?.error || 'Gagal menyimpan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-visible">
      <h3 className="text-lg font-bold text-puskesmas-900 mb-5 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
          <Activity size={18} className="text-puskesmas-600" />
        </div>
        Tambah Kegiatan Baru
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tanggal */}
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

        {/* Kategori */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => handleKategoriChange(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
          >
            <option value="dalam_gedung">Dalam Gedung</option>
            <option value="luar_gedung">Luar Gedung</option>
          </select>
        </div>

        {/* Lokasi dengan autocomplete dari constants */}
        <div>
          <Input
            label="Lokasi"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
            list="lokasi-list"
            placeholder="Pilih atau ketik lokasi..."
          />
          <datalist id="lokasi-list">
            {daftarLokasi.map((opt, idx) => (
              <option key={idx} value={opt} />
            ))}
          </datalist>
        </div>

        {/* Kegiatan dengan autocomplete dari constants */}
        <div>
          <Input
            label="Nama Kegiatan"
            value={kegiatan}
            onChange={(e) => setKegiatan(e.target.value)}
            required
            list="kegiatan-list"
            placeholder="Pilih atau ketik kegiatan..."
          />
          <datalist id="kegiatan-list">
            {daftarKegiatan.map((opt, idx) => (
              <option key={idx} value={opt} />
            ))}
          </datalist>
        </div>

        {/* Sub Kategori (hanya tampil jika luar gedung) */}
        {kategori === 'luar_gedung' && (
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">Sub Kategori</label>
            <select
              value={subKategori}
              onChange={(e) => setSubKategori(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
            >
              <option value="posyandu">Posyandu</option>
              <option value="posbindu">Posbindu</option>
              <option value="ukk">UKK (Usia Kerja & Kesehatan Kerja)</option>
              <option value="pos_remaja">Pos Remaja</option>
              <option value="pesantren">Pesantren</option>
              <option value="sekolah">Sekolah</option>
              <option value="kunjungan_lapangan">Kunjungan Lapangan</option>
              <option value="inspeksi">Inspeksi Kesehatan</option>
              <option value="rapat">Rapat</option>
              <option value="bok">BOK</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        )}

        {/* Penyerta - Multi Select dari DAFTAR_NAMA */}
        <div className="md:col-span-2 relative z-30">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            <Users size={14} className="text-puskesmas-500" /> Penyerta
          </label>

          {/* Tags untuk nama yang sudah dipilih */}
          {selectedPenyerta.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedPenyerta.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 bg-puskesmas-50 text-puskesmas-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-puskesmas-200"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removePenyerta(name)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input dengan dropdown */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchPenyerta}
                onChange={(e) => {
                  setSearchPenyerta(e.target.value);
                  setShowPenyertaDropdown(true);
                }}
                onFocus={() => setShowPenyertaDropdown(true)}
                onBlur={() => setTimeout(() => setShowPenyertaDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchPenyerta.trim()) {
                    e.preventDefault();
                    addPenyerta(searchPenyerta);
                  }
                }}
                placeholder={selectedPenyerta.length === 0 ? "Cari nama atau ketik manual lalu tekan Enter..." : "Tambah lagi..."}
                className="block w-full rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200 pr-10"
              />
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Dropdown - z-50 untuk di atas footer */}
            {showPenyertaDropdown && filteredPenyerta.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredPenyerta.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addPenyerta(name);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-puskesmas-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1.5">
            💡 Klik nama dari daftar atau ketik manual lalu tekan <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Enter</kbd> untuk menambah
          </p>
        </div>
      </div>

      <Button type="submit" className="mt-5 rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        <Save size={16} className="inline mr-1.5" /> Simpan
      </Button>
    </form>
  );
}