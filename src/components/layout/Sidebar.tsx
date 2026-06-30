import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, CalendarDays, LogIn, LogOut, User,
  ChevronRight, ChevronLeft, Menu, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { loggedIn, username, logout } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Untuk mobile: selalu full (w-72)
  // Untuk desktop: tergantung collapsed state
  const sidebarWidth = isMobile ? 'w-72' : (collapsed ? 'w-20' : 'w-64');

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`fixed top-6 z-50 ${mobileOpen ? 'left-[19rem]' : 'left-4'} w-10 h-10 flex items-center justify-center text-puskesmas-700 hover:text-puskesmas-900 transition-all duration-300 ease-in-out hover:scale-110`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen 
          ${sidebarWidth}
          ${isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-puskesmas-700 text-white flex flex-col
          shadow-xl transition-all duration-300 ease-in-out
          z-40
          ${isMobile ? 'overflow-y-auto' : 'overflow-visible'}
        `}
      >
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className={`flex flex-col items-center ${collapsed && !isMobile ? 'py-4' : 'py-6'} transition-all duration-300`}>
          <div className="relative group">
            <div className={`absolute inset-0 bg-white/20 rounded-2xl blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${collapsed && !isMobile ? 'hidden' : ''}`} />
            <Image
              src="/logo.svg"
              alt="Logo"
              width={collapsed && !isMobile ? 44 : 60}
              height={collapsed && !isMobile ? 44 : 60}
              className="relative drop-shadow-lg transition-all duration-300 hover:scale-105"
            />
          </div>
          {(!collapsed || isMobile) && (
            <div className="mt-3 text-center animate-fade-in">
              <div className="text-sm font-bold leading-tight">UPTD Puskesmas<br />Sangkali</div>
              <div className="text-[11px] opacity-70 mt-1">Tasikmalaya, Jawa Barat</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1 px-3 overflow-y-auto">
          <NavItem
            href="/"
            icon={<CalendarDays size={20} />}
            collapsed={collapsed && !isMobile}
            onClick={handleNavClick}
          >
            Jadwal Kegiatan
          </NavItem>

          {!loggedIn ? (
            <NavItem
              href="/login"
              icon={<LogIn size={20} />}
              collapsed={collapsed && !isMobile}
              onClick={handleNavClick}
            >
              Login Admin
            </NavItem>
          ) : (
            <>
              {/* User Info Card */}
              <div className={`my-2 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
                {!collapsed || isMobile ? (
                  <div className="flex items-center gap-2.5 text-xs py-2.5 px-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shadow-sm">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] opacity-70 uppercase tracking-wide">Login sebagai</div>
                      <div className="font-bold truncate text-sm">{username}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-300">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>

              <NavItem
                href="/admin"
                icon={<LayoutDashboard size={20} />}
                collapsed={collapsed && !isMobile}
                onClick={handleNavClick}
              >
                Dashboard Admin
              </NavItem>

              <button
                onClick={() => {
                  logout();
                  router.push('/');
                  handleNavClick();
                }}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                  hover:bg-red-500/30 transition-all duration-300
                  text-sm w-full text-white/90 hover:text-white
                  group mt-2
                  ${collapsed && !isMobile ? 'justify-center' : ''}
                `}
                title={collapsed && !isMobile ? 'Logout' : undefined}
              >
                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                {(!collapsed || isMobile) && <span className="font-medium">Logout</span>}
              </button>
            </>
          )}
        </nav>

        {/* Status Footer */}
        <div className={`px-3 ${collapsed && !isMobile ? 'py-3' : 'py-4'} border-t border-white/20`}>
          {!collapsed || isMobile ? (
            <div className="text-[11px] opacity-80 text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-300" />
                </span>
                <span className="font-semibold">Online</span>
              </div>
              <div className="text-white/60 text-[10px]">Senin–Jumat 07:30–14:00</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-300" />
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle button (desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-6 w-7 h-7 rounded-full bg-white border-2 border-puskesmas-200 flex items-center justify-center text-puskesmas-700 hover:bg-puskesmas-50 hover:scale-110 transition-all duration-300 z-50 shadow-md"
          style={{ left: collapsed ? '68px' : '244px' }}
          title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </>
  );
}

function NavItem({
  href,
  icon,
  children,
  collapsed,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-2.5
        ${collapsed ? 'justify-center px-2' : 'px-3'}
        py-2.5 rounded-xl text-sm
        transition-all duration-300
        relative overflow-hidden
        ${isActive
          ? 'bg-white/20 font-semibold shadow-lg shadow-black/10'
          : 'hover:bg-white/10'
        }
      `}
      title={collapsed ? children?.toString() : undefined}
    >
      {/* Active indicator */}
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
      )}

      <span
        className={`
          transition-all duration-300 shrink-0
          ${isActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'}
        `}
      >
        {icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 min-w-0 truncate">{children}</span>
          {isActive && <ChevronRight size={14} className="opacity-70 shrink-0" />}
        </>
      )}
    </Link>
  );
}