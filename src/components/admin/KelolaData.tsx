'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiGet, apiPost, apiPut } from '@/lib/api';
import { generateExcel, generatePDF } from '@/lib/utils';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Trash2, FileText, FileSpreadsheet, X, Database, Edit3, Calendar, ChevronDown } from 'lucide-react';
import { Kegiatan } from '@/types';

interface GroupedKegiatan {
  key: string;
  tanggal: string;
  lokasi: string;
  kegiatan: string;
  penyerta: string;
  kategori: 'dalam_gedung' | 'luar_gedung';
  sub_kategori: string;
  ids: number[];
}

export default function KelolaData() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? undefined : undefined;

  const [data, setData] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(!!token);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editItem, setEditItem] = useState<GroupedKegiatan | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const deleteMenuRef = useRef<HTMLDivElement>(null);
  const deleteBtnRef = useRef<HTMLDivElement>(null);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        deleteMenuRef.current && !deleteMenuRef.current.contains(event.target as Node) &&
        deleteBtnRef.current && !deleteBtnRef.current.contains(event.target as Node)
      ) {
        setShowDeleteMenu(false);
      }
    };

    if (showDeleteMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteMenu]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiGet('kegiatan/', {}, token);
        setData(res as Kegiatan[]);
      } catch {
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const refreshData = async () => {
    try {
      const res = await apiGet('kegiatan/', {}, token);
      setData(res as Kegiatan[]);
    } catch {
      // Silent
    }
  };

  const toggleDeleteMenu = () => {
    if (!showDeleteMenu && deleteBtnRef.current) {
      const rect = deleteBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setShowDeleteMenu(!showDeleteMenu);
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;
    const ids = selectedRows.map(i => data[i].id);
    try {
      await apiPost('kegiatan/bulk-delete/', { ids }, token ?? '');
      toast.success(`${ids.length} data dihapus`);
      setSelectedRows([]);
      await refreshData();
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Yakin ingin menghapus SEMUA data?')) return;
    const ids = data.map(d => d.id);
    try {
      await apiPost('kegiatan/bulk-delete/', { ids }, token ?? '');
      toast.success('Semua data dihapus');
      setSelectedRows([]);
      await refreshData();
    } catch {
      toast.error('Gagal menghapus');
    }
    setShowDeleteMenu(false);
  };

  const handleDeleteByMonth = async () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const ids = data
      .filter(d => {
        const date = new Date(d.tanggal);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .map(d => d.id);

    if (ids.length === 0) {
      toast.error('Tidak ada data bulan ini');
      return;
    }

    if (!confirm(`Yakin ingin menghapus ${ids.length} data bulan ini?`)) return;

    try {
      await apiPost('kegiatan/bulk-delete/', { ids }, token ?? '');
      toast.success(`${ids.length} data bulan ini dihapus`);
      setSelectedRows([]);
      await refreshData();
    } catch {
      toast.error('Gagal menghapus');
    }
    setShowDeleteMenu(false);
  };

  const handleDeleteByWeek = async () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const ids = data
      .filter(d => {
        const date = new Date(d.tanggal);
        return date >= weekAgo && date <= now;
      })
      .map(d => d.id);

    if (ids.length === 0) {
      toast.error('Tidak ada data minggu ini');
      return;
    }

    if (!confirm(`Yakin ingin menghapus ${ids.length} data minggu ini?`)) return;

    try {
      await apiPost('kegiatan/bulk-delete/', { ids }, token ?? '');
      toast.success(`${ids.length} data minggu ini dihapus`);
      setSelectedRows([]);
      await refreshData();
    } catch {
      toast.error('Gagal menghapus');
    }
    setShowDeleteMenu(false);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    try {
      await apiPut(`kegiatan/${editItem.ids[0]}/`, {
        tanggal: editItem.tanggal,
        lokasi: editItem.lokasi,
        kegiatan: editItem.kegiatan,
        penyerta: editItem.penyerta,
        kategori: editItem.kategori,
        sub_kategori: editItem.sub_kategori,
      }, token ?? '');
      toast.success('Data diperbarui');
      setEditItem(null);
      await refreshData();
    } catch {
      toast.error('Gagal update');
    }
  };

  if (loading) return (
    <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-gray-200">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-puskesmas-600 mb-3" />
      <p className="text-gray-500 font-medium">Memuat data...</p>
    </div>
  );

  const grouped: GroupedKegiatan[] = data.reduce((acc: GroupedKegiatan[], item) => {
    const key = `${item.tanggal}|${item.lokasi}|${item.kegiatan}`;
    const existing = acc.find(x => x.key === key);
    if (existing) {
      existing.ids.push(item.id);
      existing.penyerta += ';\n' + item.penyerta;
    } else {
      acc.push({
        key,
        tanggal: item.tanggal,
        lokasi: item.lokasi,
        kegiatan: item.kegiatan,
        penyerta: item.penyerta,
        kategori: item.kategori || 'luar_gedung',
        sub_kategori: item.sub_kategori || 'lainnya',
        ids: [item.id],
      });
    }
    return acc;
  }, []);

  const columns = ['Tanggal', 'Kategori', 'Lokasi', 'Kegiatan', 'Penyerta'];
  const rows = grouped.map(g => [
    g.tanggal,
    g.kategori === 'dalam_gedung' ? 'Dalam Gedung' : 'Luar Gedung',
    g.lokasi,
    g.kegiatan,
    g.penyerta,
  ]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-puskesmas-500/10 to-puskesmas-600/10 flex items-center justify-center">
              <Database size={22} className="text-puskesmas-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-puskesmas-900">Daftar Semua Kegiatan</h3>
              <p className="text-sm text-gray-500">Total {data.length} data kegiatan</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => generateExcel(data, 'semua_kegiatan.xlsx')}
              variant="secondary"
              className="rounded-xl px-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <FileSpreadsheet size={16} className="inline mr-1.5" /> Excel
            </Button>
            <Button
              onClick={() => generatePDF(data, 'JADWAL PELAYANAN PUSKESMAS SANGKALI')}
              variant="secondary"
              className="rounded-xl px-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <FileText size={16} className="inline mr-1.5" /> PDF
            </Button>

            {/* Dropdown Delete Button */}
            <div className="relative" ref={deleteBtnRef}>
              <Button
                onClick={toggleDeleteMenu}
                variant="danger"
                className="rounded-xl px-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <Trash2 size={16} className="inline mr-1.5" /> Hapus
                <ChevronDown size={14} className="inline ml-1.5" />
              </Button>

              {showDeleteMenu && menuPos && typeof document !== 'undefined' && createPortal(
                <div
                  ref={deleteMenuRef}
                  style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
                  className="w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
                >
                  <button
                    onClick={handleDeleteByWeek}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                  >
                    <Calendar size={16} className="text-red-500" />
                    <span>Hapus Minggu Ini</span>
                  </button>
                  <button
                    onClick={handleDeleteByMonth}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                  >
                    <Calendar size={16} className="text-red-500" />
                    <span>Hapus Bulan Ini</span>
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 font-semibold"
                  >
                    <Trash2 size={16} className="text-red-600" />
                    <span>Hapus Semua Data</span>
                  </button>
                </div>,
                document.body
              )}
            </div>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-gray-200">
          <Database size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium text-lg">Belum ada data</p>
          <p className="text-gray-400 text-sm mt-1">Tambahkan kegiatan baru melalui menu Input Manual</p>
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100">
            <DataTable
              columns={columns}
              rows={rows}
              onRowSelect={(idx) => {
                setSelectedRows(prev =>
                  prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                );
              }}
              selectedRows={selectedRows}
            />
          </div>

          {selectedRows.length > 0 && (
            <div className="bg-red-50/50 border border-red-200/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Trash2 size={16} className="text-red-600" />
                </div>
                <span className="font-medium">{selectedRows.length} data terpilih</span>
              </div>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="rounded-xl px-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <Trash2 size={16} className="inline mr-1.5" /> Hapus Terpilih
              </Button>
            </div>
          )}

          {/* Edit Modal */}
          {editItem && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full space-y-5 animate-fadeInUp border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
                      <Edit3 size={20} className="text-puskesmas-600" />
                    </div>
                    <h4 className="text-lg font-bold text-puskesmas-900">Edit Kegiatan</h4>
                  </div>
                  <button
                    onClick={() => setEditItem(null)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Tanggal"
                    type="date"
                    value={editItem.tanggal}
                    onChange={(e) => setEditItem({ ...editItem, tanggal: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                      <select
                        value={editItem.kategori}
                        onChange={(e) => setEditItem({ ...editItem, kategori: e.target.value as 'dalam_gedung' | 'luar_gedung' })}
                        className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
                      >
                        <option value="dalam_gedung">Dalam Gedung</option>
                        <option value="luar_gedung">Luar Gedung</option>
                      </select>
                    </div>
                    {editItem.kategori === 'luar_gedung' && (
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">Sub Kategori</label>
                        <select
                          value={editItem.sub_kategori}
                          onChange={(e) => setEditItem({ ...editItem, sub_kategori: e.target.value })}
                          className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200"
                        >
                          <option value="posyandu">Posyandu</option>
                          <option value="posbindu">Posbindu</option>
                          <option value="ukk">UKK</option>
                          <option value="pos_remaja">Pos Remaja</option>
                          <option value="pesantren">Pesantren</option>
                          <option value="sekolah">Sekolah</option>
                          <option value="kunjungan_lapangan">Kunjungan Lapangan</option>
                          <option value="inspeksi">Inspeksi</option>
                          <option value="rapat">Rapat</option>
                          <option value="bok">BOK</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <Input
                    label="Lokasi"
                    value={editItem.lokasi}
                    onChange={(e) => setEditItem({ ...editItem, lokasi: e.target.value })}
                  />
                  <Input
                    label="Kegiatan"
                    value={editItem.kegiatan}
                    onChange={(e) => setEditItem({ ...editItem, kegiatan: e.target.value })}
                  />
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                      Penyerta
                    </label>
                    <textarea
                      value={editItem.penyerta}
                      onChange={(e) => setEditItem({ ...editItem, penyerta: e.target.value })}
                      rows={4}
                      className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-puskesmas-500/30 focus:border-puskesmas-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    onClick={() => setEditItem(null)}
                    className="rounded-xl px-5"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className="rounded-xl px-5 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}