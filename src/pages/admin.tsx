import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import InputKegiatanForm from '@/components/forms/InputKegiatanForm';
import GoogleSheetSync from '@/components/admin/GoogleSheetSync';
import SearchForm from '@/components/forms/SearchForm';
import KelolaData from '@/components/admin/KelolaData';
import History from '@/components/admin/History';
import RandomizeJadwal from '@/components/admin/RandomizeJadwal';
import { FileEdit, FileSpreadsheet, Search, Database, History as HistoryIcon, Shuffle } from 'lucide-react';

export default function AdminDashboard() {
  const { loggedIn, username } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    if (!loggedIn) router.push('/login');
  }, [loggedIn, router]);

  if (!loggedIn) return null;

  const tabs = [
    { key: 'input', label: 'Input Manual', icon: <FileEdit size={18} /> },
    { key: 'sheets', label: 'Google Sheet', icon: <FileSpreadsheet size={18} /> },
    { key: 'search', label: 'Pencarian', icon: <Search size={18} /> },
    { key: 'manage', label: 'Kelola Data', icon: <Database size={18} /> },
    { key: 'history', label: 'History', icon: <HistoryIcon size={18} /> },
    { key: 'randomize', label: 'Randomize', icon: <Shuffle size={18} /> },
  ];

  return (
    <>
      <Header
        title="Dashboard Manajemen"
        subtitle={`Selamat datang, ${username}`}
        slides={[
          '/images/slide1.jpg',
          '/images/slide2.jpg',
          '/images/slide3.jpg',
        ]}
      />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="bg-white-700 p-2 rounded-2xl shadow-md  border border-gray-200">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap
                  transition-all duration-300 shrink-0
                  ${activeTab === tab.key
                    ? 'bg-puskesmas-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-puskesmas-50 hover:text-puskesmas-700'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'input' && <InputKegiatanForm />}
        {activeTab === 'sheets' && <GoogleSheetSync />}
        {activeTab === 'search' && <SearchForm />}
        {activeTab === 'manage' && <KelolaData />}
        {activeTab === 'history' && <History />}
        {activeTab === 'randomize' && <RandomizeJadwal />}
      </div>
    </>
  );
}