import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { LogIn, Shield, Lock } from 'lucide-react';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Isi username dan password.');
      return;
    }
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      toast.success('Login berhasil');
      router.push('/admin');
    } else {
      toast.error('Username atau password salah');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      {/* Card Wrapper */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-puskesmas-500/10 border border-white/60 relative overflow-hidden group hover:shadow-puskesmas-500/20 transition-all duration-500">
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-puskesmas-500/10 rounded-full blur-3xl group-hover:bg-puskesmas-500/20 transition-all duration-500" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500" />

        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-puskesmas-500 to-puskesmas-700 shadow-lg shadow-puskesmas-500/30 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <LogIn size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-puskesmas-900 mb-1">Selamat Datang</h2>
          <p className="text-sm text-gray-500">Silakan masuk ke akun Anda</p>
        </div>

        {/* Form Fields */}
        <div className="relative space-y-5">
          <Input 
            label="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Masukkan username"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            loading={loading} 
            className="w-full py-3.5! rounded-xl! font-semibold! bg-linear-to-r from-puskesmas-600 to-puskesmas-700! text-white! shadow-lg shadow-puskesmas-500/30 hover:shadow-xl hover:shadow-puskesmas-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Lock size={16} className="inline mr-2" /> Masuk
          </Button>
        </div>

        {/* Security Badge */}
        <div className="relative mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-green-500" />
            <span>Koneksi aman & terenkripsi</span>
          </div>
        </div>
      </div>
    </form>
  );
}