import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white text-puskesmas-800 mt-16 overflow-hidden">
      <div className="relative max-w-6xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="group">
            <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-puskesmas-900">
              <div className="w-8 h-8 rounded-lg bg-puskesmas-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin size={16} className="text-puskesmas-600" />
              </div>
              Puskesmas Sangkali
            </h4>
            <div className="space-y-2 text-puskesmas-700/80">
              <p className="flex items-start gap-2 hover:text-puskesmas-900 transition-colors">
                <MapPin size={14} className="text-puskesmas-500 shrink-0 mt-0.5" /> 
                <span>Jl. Mugarsari, Kec. Tamansari, Kab. Tasikmalaya, Jawa Barat 46196</span>
              </p>
              <p className="flex items-center gap-2 hover:text-puskesmas-900 transition-colors">
                <Phone size={14} className="text-puskesmas-500 shrink-0" /> 0855-2376-1600
              </p>
              <p className="flex items-center gap-2 hover:text-puskesmas-900 transition-colors">
                <Mail size={14} className="text-puskesmas-500 shrink-0" /> pkmsangkali@gmail.com
              </p>
            </div>
          </div>

          <div className="group">
            <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-puskesmas-900">
              <div className="w-8 h-8 rounded-lg bg-puskesmas-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock size={16} className="text-puskesmas-600" />
              </div>
              Jam Operasional
            </h4>
            <div className="space-y-2 text-puskesmas-700/80">
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-puskesmas-500 shrink-0" /> Senin–Kamis: 07:30–14:00
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-puskesmas-500 shrink-0" /> Jumat: 07:30–11:30
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-puskesmas-500 shrink-0" /> Sabtu: 07:30–12:00
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base mb-4 text-puskesmas-900">Tentang Kami</h4>
            <p className="text-puskesmas-700/80 leading-relaxed">
              UPTD Puskesmas Sangkali berkomitmen memberikan pelayanan kesehatan terbaik untuk masyarakat Tasikmalaya.
            </p>
          </div>
        </div>

        <div className="relative mt-8 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-puskesmas-500">
          <p>&copy; {new Date().getFullYear()} UPTD Puskesmas Sangkali. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}