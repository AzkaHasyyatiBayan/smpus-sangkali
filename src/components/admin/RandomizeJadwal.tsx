'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { Shuffle, AlertCircle, Calendar, Save, Eye, Edit2, X, Building2, HeartPulse, Users, LucideIcon } from 'lucide-react';

interface PreviewItem {
  tanggal: string;
  lokasi: string;
  kegiatan: string;
  penyerta: string;
  kategori: string;
  sub_kategori?: string;
}

type SectionType = 'dalam_gedung' | 'bok' | 'lainnya';

export default function RandomizeJadwal() {
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [lokaKarya, setLokaKarya] = useState(false);
  const [loading, setLoading] = useState<Record<SectionType, boolean>>({
    dalam_gedung: false, bok: false, lainnya: false
  });
  
  const [previews, setPreviews] = useState<Record<SectionType, PreviewItem[] | null>>({
    dalam_gedung: null, bok: null, lainnya: null
  });
  const [skipped, setSkipped] = useState<Record<SectionType, string[]>>({
    dalam_gedung: [], bok: [], lainnya: []
  });
  const [editingIndex, setEditingIndex] = useState<Record<SectionType, number | null>>({
    dalam_gedung: null, bok: null, lainnya: null
  });
  const [editData, setEditData] = useState<Record<SectionType, Partial<PreviewItem>>>({
    dalam_gedung: {}, bok: {}, lainnya: {}
  });

  const endpoints: Record<SectionType, string> = {
    dalam_gedung: 'randomize-dalam-gedung/',
    bok: 'randomize-luar-gedung-bok/',
    lainnya: 'randomize-luar-gedung-lainnya/',
  };

  const sectionConfig: Record<SectionType, { label: string; icon: LucideIcon; color: string; description: string }> = {
    dalam_gedung: {
      label: 'Dalam Gedung',
      icon: Building2,
      color: 'from-blue-500/10 to-cyan-500/10',
      description: 'Jadwal ruangan dalam gedung puskesmas (Pendaftaran, Poli, Klaster, dll)'
    },
    bok: {
      label: 'BOK (Bantuan Operasional Kesehatan)',
      icon: HeartPulse,
      color: 'from-purple-500/10 to-pink-500/10',
      description: '31 kegiatan BOK + Sekolah/Pesantren (Pelacakan ODGJ, Inspeksi, STBM, Skrining Sekolah, dll)'
    },
    lainnya: {
      label: 'Pelayanan Luar Gedung',
      icon: Users,
      color: 'from-green-500/10 to-emerald-500/10',
      description: 'Jadwal tetap Posyandu, Posbindu, UKK, dan Pos Remaja sesuai jadwal buka'
    },
  };

  const formatPenyerta = (penyerta: string) => {
    if (!penyerta) return '-';
    return penyerta.split(';').map((nama, idx) => (
      <span key={idx} className="block">{nama.trim()}</span>
    ));
  };

  const handlePreview = async (jenis: SectionType) => {
    setLoading(prev => ({ ...prev, [jenis]: true }));
    setPreviews(prev => ({ ...prev, [jenis]: null }));
    setSkipped(prev => ({ ...prev, [jenis]: [] }));
    
    const token = localStorage.getItem('token');
    try {
      const res = await apiPost(endpoints[jenis], {
        bulan, tahun,
        loka_karya: lokaKarya,
        preview: true,
      }, token ?? '');
      
      const data = res.data as { jadwal?: PreviewItem[]; skipped?: string[]; message?: string };
      
      if (res.status === 200 && data.jadwal) {
        setPreviews(prev => ({ ...prev, [jenis]: data.jadwal! }));
        setSkipped(prev => ({ ...prev, [jenis]: data.skipped || [] }));
        toast.success(`${sectionConfig[jenis].label}: ${data.jadwal.length} jadwal berhasil di-generate`);
      } else {
        toast.error(data.message || 'Gagal generate jadwal');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(prev => ({ ...prev, [jenis]: false }));
    }
  };

  const handleEdit = (jenis: SectionType, index: number, item: PreviewItem) => {
    setEditingIndex(prev => ({ ...prev, [jenis]: index }));
    setEditData(prev => ({ ...prev, [jenis]: { ...item } }));
  };

  const handleSaveEdit = (jenis: SectionType) => {
    const currentPreview = previews[jenis];
    const currentEditIndex = editingIndex[jenis];
    const currentEditData = editData[jenis];
    
    if (currentPreview && currentEditIndex !== null) {
      const newPreview = [...currentPreview];
      newPreview[currentEditIndex] = { ...newPreview[currentEditIndex], ...currentEditData };
      setPreviews(prev => ({ ...prev, [jenis]: newPreview }));
      setEditingIndex(prev => ({ ...prev, [jenis]: null }));
      setEditData(prev => ({ ...prev, [jenis]: {} }));
      toast.success('Jadwal berhasil diedit');
    }
  };

  const handleCancelEdit = (jenis: SectionType) => {
    setEditingIndex(prev => ({ ...prev, [jenis]: null }));
    setEditData(prev => ({ ...prev, [jenis]: {} }));
  };

  const handleSave = async (jenis: SectionType) => {
    const currentPreview = previews[jenis];
    if (!currentPreview || !confirm(`Yakin ingin menyimpan ${currentPreview.length} jadwal ${sectionConfig[jenis].label} ke database?`)) return;
    
    setLoading(prev => ({ ...prev, [jenis]: true }));
    const token = localStorage.getItem('token');
    
    try {
      const res = await apiPost(endpoints[jenis], {
        bulan, tahun,
        loka_karya: lokaKarya,
        preview: false,
      }, token ?? '');
      
      if (res.status === 200) {
        const responseData = res.data as { message?: string };
        toast.success(responseData.message || `Jadwal ${sectionConfig[jenis].label} berhasil disimpan`);
        setPreviews(prev => ({ ...prev, [jenis]: null }));
        setSkipped(prev => ({ ...prev, [jenis]: [] }));
      } else {
        toast.error('Gagal menyimpan jadwal');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(prev => ({ ...prev, [jenis]: false }));
    }
  };

  const renderSection = (jenis: SectionType) => {
    const config = sectionConfig[jenis];
    const Icon = config.icon;
    const preview = previews[jenis];
    const sectionSkipped = skipped[jenis];
    const currentEditingIndex = editingIndex[jenis];
    const currentEditData = editData[jenis];
    const isLoading = loading[jenis];

    return (
      <div key={jenis} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${config.color} flex items-center justify-center shrink-0`}>
            <Icon size={22} className="text-puskesmas-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-puskesmas-900">{config.label}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{config.description}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => handlePreview(jenis)} 
              loading={isLoading}
              variant="secondary"
              className="rounded-xl px-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <Eye size={14} className="inline mr-1.5" /> Preview
            </Button>
            {preview && preview.length > 0 && (
              <Button 
                onClick={() => handleSave(jenis)} 
                loading={isLoading}
                className="rounded-xl px-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-linear-to-r from-green-600 to-emerald-600!"
              >
                <Save size={14} className="inline mr-1.5" /> Simpan
              </Button>
            )}
          </div>
        </div>

        {sectionSkipped.length > 0 && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <p className="font-semibold mb-1">Catatan:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {sectionSkipped.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {preview && preview.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Tanggal</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Lokasi</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Kegiatan</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Penyerta</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {preview.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {currentEditingIndex === idx ? (
                      <>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={currentEditData.tanggal || item.tanggal}
                            onChange={(e) => setEditData(prev => ({ ...prev, [jenis]: { ...prev[jenis], tanggal: e.target.value } }))}
                            className="block w-full rounded-lg border border-gray-300 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={currentEditData.lokasi || item.lokasi}
                            onChange={(e) => setEditData(prev => ({ ...prev, [jenis]: { ...prev[jenis], lokasi: e.target.value } }))}
                            className="block w-full rounded-lg border border-gray-300 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={currentEditData.kegiatan || item.kegiatan}
                            onChange={(e) => setEditData(prev => ({ ...prev, [jenis]: { ...prev[jenis], kegiatan: e.target.value } }))}
                            className="block w-full rounded-lg border border-gray-300 px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <textarea
                            value={currentEditData.penyerta || item.penyerta}
                            onChange={(e) => setEditData(prev => ({ ...prev, [jenis]: { ...prev[jenis], penyerta: e.target.value } }))}
                            className="block w-full rounded-lg border border-gray-300 px-2 py-1 text-xs"
                            rows={3}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveEdit(jenis)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => handleCancelEdit(jenis)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 whitespace-nowrap align-top">{item.tanggal}</td>
                        <td className="px-3 py-2 align-top">{item.lokasi}</td>
                        <td className="px-3 py-2 font-medium align-top">{item.kegiatan}</td>
                        <td className="px-3 py-2 text-xs align-top">
                          <div className="flex flex-col gap-0.5">
                            {formatPenyerta(item.penyerta)}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <button
                            onClick={() => handleEdit(jenis, idx, item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 size={14} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!preview && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">Klik &quot;Preview&quot; untuk generate jadwal {config.label}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center shrink-0">
            <Shuffle size={22} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-puskesmas-900">Randomize Jadwal</h3>
            <p className="text-sm text-gray-500 mt-1">Generate jadwal otomatis bertahap: Dalam Gedung → BOK → Pelayanan Luar Gedung</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200/60 rounded-xl mb-5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 text-sm text-amber-800">
            <strong className="block mb-1">Perhatian!</strong>
            Pastikan data <strong>PIKET PERSALINAN</strong> sudah diinput terlebih dahulu. Orang yang piket malam akan otomatis libur keesokan harinya.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select 
            label="Bulan" 
            value={bulan.toString()} 
            onChange={(e) => setBulan(parseInt(e.target.value))} 
            options={['1','2','3','4','5','6','7','8','9','10','11','12']} 
          />
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={14} className="text-puskesmas-500" /> Tahun
            </label>
            <input 
              type="number" 
              value={tahun} 
              onChange={(e) => setTahun(parseInt(e.target.value))} 
              className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={lokaKarya} 
                onChange={(e) => setLokaKarya(e.target.checked)} 
                className="w-4 h-4 rounded border-gray-300 text-puskesmas-600 focus:ring-puskesmas-500"
              />
              <span className="text-sm font-medium text-gray-700">Loka Karya Mini Bulanan</span>
            </label>
          </div>
        </div>
      </div>

      {renderSection('dalam_gedung')}
      {renderSection('bok')}
      {renderSection('lainnya')}
    </div>
  );
}