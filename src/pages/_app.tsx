import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Margin left hanya untuk desktop
  const marginLeft = isMobile ? '0px' : (sidebarCollapsed ? '80px' : '256px');

  return (
    <AuthProvider>
      <ToastProvider />
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div 
          className="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
          style={{ marginLeft }}
        >
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}