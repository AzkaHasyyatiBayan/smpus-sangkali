import { ReactNode } from 'react';

interface Props {
  title: string;
  value: number | string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="group relative bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200/60 p-5 rounded-2xl text-center overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Decorative */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200/30 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />

      <div className="relative">
        <div className="flex items-center justify-center gap-2 text-puskesmas-700 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-extrabold text-puskesmas-800 mb-1 tabular-nums">{value}</div>
        <div className="text-sm text-gray-600 font-medium">{title}</div>
      </div>
    </div>
  );
}