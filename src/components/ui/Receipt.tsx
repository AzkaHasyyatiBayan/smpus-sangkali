import Badge from './Badge';
import { parsePenyerta } from '@/lib/utils';
import { FileText, Calendar, MapPin, Users } from 'lucide-react';

interface ReceiptItem {
  tanggal: string;
  lokasi: string;
  kegiatan: string;
  penyerta: string;
  status?: 'past' | 'today' | 'soon' | 'future';
}

interface Props {
  title: string;
  subtitle?: string;
  items: ReceiptItem[];
}

export default function Receipt({ title, subtitle, items }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in font-mono">
      {/* Header */}
      <div className="bg-white text-puskesmas-900 p-5 border-b border-dashed border-gray-300 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FileText size={18} className="text-puskesmas-700" />
          <h3 className="font-bold text-lg tracking-wide uppercase">{title}</h3>
        </div>
        {subtitle && <p className="text-xs text-gray-500 tracking-wider uppercase">{subtitle}</p>}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {items.map((item, idx) => {
          const penyList = parsePenyerta(item.penyerta);
          return (
            <div
              key={idx}
              className="group pb-3 border-b border-dashed border-gray-200 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-bold text-puskesmas-900 text-sm">
                  {item.kegiatan}
                </div>
                {item.status && (
                  <Badge status={item.status}>
                    {item.status === 'past' ? 'Lewat' : item.status === 'today' ? 'Hari ini' : item.status === 'soon' ? 'Besok' : 'Akan datang'}
                  </Badge>
                )}
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <Calendar size={12} className="text-puskesmas-600 shrink-0 mt-0.5" />
                  <span className="text-gray-800">{item.tanggal}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-puskesmas-600 shrink-0 mt-0.5" />
                  <span className="text-gray-800">{item.lokasi}</span>
                </div>
                {/* PERBAIKAN: Tampilan Penyerta Vertikal */}
                <div className="flex items-start gap-2">
                  <Users size={12} className="text-puskesmas-600 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 text-gray-800">
                    {penyList.length > 0
                      ? penyList.map((p, i) => (
                          <span key={i} className="text-xs leading-relaxed">
                            {p}
                          </span>
                        ))
                      : <span className="text-xs">{item.penyerta}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - style receipt (zigzag pattern) */}
      <div className="relative bg-white border-t border-dashed border-gray-300 px-5 py-4 text-center">
        <div className="text-[10px] text-gray-400 tracking-widest mb-1">
          ✦  ✦ ✦ ✦ ✦ ✦  ✦ ✦ ✦ ✦ ✦  ✦ ✦ ✦ ✦ ✦  ✦ ✦ ✦ ✦ ✦ 
        </div>
        <div className="text-xs font-semibold text-puskesmas-800 tracking-wider">
          PUSKESMAS SANGKALI
        </div>
        <div className="text-[10px] text-gray-400 mt-1">
          Semangat dan Selamat Menjalani Tugas
        </div>
      </div>
    </div>
  );
}