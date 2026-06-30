'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Lock, ShieldCheck, Stethoscope } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Username dan password wajib diisi');
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
    <div className="min-h-screen flex flex-col bg-linear-to-br from-puskesmas-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-puskesmas-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <main className="grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-md w-full animate-fadeInUp">
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-puskesmas-600 to-puskesmas-800 shadow-xl shadow-puskesmas-500/30 mb-4 hover:scale-105 transition-transform duration-300">
              <Stethoscope size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-puskesmas-900">Puskesmas Sangkali</h1>
            <p className="text-sm text-gray-500 mt-1">Portal Admin Login</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50">
            <div className="flex items-center gap-2 text-puskesmas-700 mb-6 justify-center">
              <div className="w-10 h-10 rounded-xl bg-puskesmas-500/10 flex items-center justify-center">
                <ShieldCheck size={22} className="text-puskesmas-600" />
              </div>
              <span className="font-bold text-lg">Masuk Akun</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} className="w-full py-3! rounded-xl! font-semibold! shadow-lg shadow-puskesmas-500/20 hover:shadow-xl hover:shadow-puskesmas-500/30 transition-all duration-300">
                <Lock size={16} className="inline mr-2" /> Masuk
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} UPTD Puskesmas Sangkali
          </p>
        </div>
      </main>
    </div>
  );
}