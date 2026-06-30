'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiGet, apiPost } from '@/lib/api';
import { generateExcel, generatePDF, formatTanggal, parsePenyerta } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Calendar, MapPin, Users, FileText, FileSpreadsheet, Inbox, Trash2, ChevronDown } from 'lucide-react';
import { Kegiatan } from '@/types';
import toast from 'react-hot-toast';

type StatusFilter = 'Semua' | 'Sudah Lewat' | 'Hari Ini' | 'Akan Datang';

function getInitialDates() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  return { today, tomorrow };
}

export default function History() {
  const [data, setData] = useState<Kegiatan[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('Semua');
  const [bulan, setBulan] = useState('Semua');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? undefined : undefined;
  const deleteMenuRef = useRef<HTMLDivElement>(null);
  const deleteBtnRef = useRef<HTMLDivElement>(null);

  const [{ today, tomorrow }] = useState(getInitialDates);

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
        // gagal memuat
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

  const filtered = useMemo(() => {
    if (!today) return [];

    let result = data.filter(item => {
      const tanggal = item.tanggal;
      if (filter === 'Sudah Lewat') return tanggal < today;
      if (filter === 'Hari Ini') return tanggal === today;
      if (filter === 'Akan Datang') return tanggal > today;
      return true;
    });

    if (bulan !== 'Semua') {
      const monthIndex = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(bulan);
      result = result.filter(item => new Date(item.tanggal).getMonth() === monthIndex);
    }

    result.sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    return result;
  }, [data, filter, bulan, today]);

  const getStatus = (tanggal: string) => {
    if (tanggal < today) return 'past' as const;
    if (tanggal === today) return 'today' as const;
    if (tanggal === tomorrow) return 'soon' as const;
    return 'future' as const;
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

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} data terpilih?`)) return;

    try {
      await apiPost('kegiatan/bulk-delete/', { ids: selectedIds }, token ?? '');
      toast.success(`${selectedIds.length} data dihapus`);
      setSelectedIds([]);
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
      setSelectedIds([]);
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
      setSelectedIds([]);
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
      setSelectedIds([]);
      await refreshData();
    } catch {
      toast.error('Gagal menghapus');
    }
    setShowDeleteMenu(false);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Filter & Action Bar */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end flex-1">
            <div className="flex-1 min-w-[160px]">
              <Select
                label="Status"
                value={filter}
                onChange={(e) => setFilter(e.target.value as StatusFilter)}
                options={['Semua', 'Sudah Lewat', 'Hari Ini', 'Akan Datang']}
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <Select
                label="Bulan"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                options={['Semua', 'Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => generateExcel(filtered, 'history.xlsx')}
              variant="secondary"
              className="rounded-xl px-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <FileSpreadsheet size={16} className="inline mr-1.5" /> Excel
            </Button>
            <Button
              onClick={() => generatePDF(filtered, 'HISTORY KEGIATAN')}
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

      {/* Selected Items Action */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50/50 border border-red-200/50 p-4 rounded-2xl flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Trash2 size={16} className="text-red-600" />
            </div>
            <span className="font-medium">{selectedIds.length} data terpilih</span>
          </div>
          <Button
            onClick={handleDeleteSelected}
            variant="danger"
            className="rounded-xl px-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <Trash2 size={16} className="inline mr-1.5" /> Hapus Terpilih
          </Button>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium text-lg">Tidak ada data</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau tambahkan data baru</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const penyertaList = parsePenyerta(item.penyerta);

            return (
              <div
                key={idx}
                className={`group bg-white/80 backdrop-blur-sm p-5 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                  selectedIds.includes(item.id) ? 'border-red-300 bg-red-50/30' : 'border-gray-100'
                }`}
                onClick={() => toggleSelectItem(item.id)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-puskesmas-500/10 to-puskesmas-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Calendar size={18} className="text-puskesmas-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-puskesmas-900 text-base mb-2 group-hover:text-puskesmas-700 transition-colors">
                        {item.kegiatan}
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={13} className="text-puskesmas-400 shrink-0" />
                          <span>{formatTanggal(item.tanggal)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={13} className="text-puskesmas-400 shrink-0" />
                          <span className="truncate">{item.lokasi}</span>
                        </div>
                        {item.penyerta && (
                          <div className="flex items-start gap-2 text-xs text-gray-500 pt-1">
                            <Users size={12} className="text-puskesmas-400 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-0.5">
                              {penyertaList.map((nama, i) => (
                                <span key={i} className="text-gray-600">
                                  {nama}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <Badge status={getStatus(item.tanggal)}>
                      {item.tanggal < today ? 'Lewat' : item.tanggal === today ? 'Hari ini' : item.tanggal === tomorrow ? 'Besok' : 'Akan datang'}
                    </Badge>
                    {selectedIds.includes(item.id) && (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}