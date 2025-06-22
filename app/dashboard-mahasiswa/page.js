'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser, FaCalendarAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import clsx from 'clsx';

export default function DashboardMahasiswa() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ jumlahUKM: 0, kegiatanHariIni: 0, pengumumanAktif: 0 });
  const [daftarPengumuman, setDaftarPengumuman] = useState([]);
  const [kegiatanSaya, setKegiatanSaya] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const resDashboard = await fetch('/api/dashboard');
      const data = await resDashboard.json();
      setStats({
        jumlahUKM: data.jumlahUKM || 0,
        kegiatanHariIni: data.kegiatanHariIni || 0,
        pengumumanAktif: data.pengumumanAktif || 0,
      });
      setDaftarPengumuman(data.daftarPengumuman || []);

      const resKegiatanSaya = await fetch('/api/kegiatan-mahasiswa');
      const dataSaya = await resKegiatanSaya.json();
      setKegiatanSaya(Array.isArray(dataSaya) ? dataSaya : []);
    } catch (err) {
      console.error('Gagal fetch data:', err);
    }
  };

  const handleLogout = () => signOut({ callbackUrl: '/login' });

  const avatar = session?.user?.avatar || `https://ui-avatars.com/api/?name=${session?.user?.nama || 'Mahasiswa'}&background=34d399&color=fff&rounded=true`;

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-green-50 text-green-700">Memuat dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navigation */}
      <header className="bg-white shadow px-4 py-4 flex justify-between items-center lg:justify-start lg:gap-8">
        <div className="lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-green-800 text-2xl">
            <FaBars />
          </button>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-green-800">Dashboard Mahasiswa</h1>

        {/* Navigation - desktop */}
        <nav className="hidden lg:flex gap-6 ml-auto">
          {menuLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-green-800 hover:text-green-600 font-medium flex items-center gap-1">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>

        {/* Profil hanya muncul di mobile */}
        <Link href="/dashboard-mahasiswa/profil" className="lg:hidden">
          <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-green-400 shadow object-cover" />
        </Link>
      </header>

      {/* Sidebar Mobile */}
      <aside className={clsx('fixed top-0 left-0 h-full bg-green-900 text-white z-40 transition-transform duration-300 w-64 shadow-xl lg:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="px-4 py-5 border-b border-green-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">UKM</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-white text-lg">✕</button>
        </div>
        <nav className="flex flex-col gap-2 px-3 mt-4">
          {menuLinks.map((link) => (
            <button key={link.href} onClick={() => { setSidebarOpen(false); router.push(link.href); }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-800 text-left w-full">
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 mt-4 bg-red-600 hover:bg-red-700 rounded-lg">
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-30" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="p-6 max-w-screen-xl mx-auto">
        {/* Statistik */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatBox title="Total UKM" value={stats.jumlahUKM} color="bg-yellow-400" />
          <StatBox title="Kegiatan Hari Ini" value={stats.kegiatanHariIni} color="bg-green-400" />
          <StatBox title="Pengumuman Aktif" value={stats.pengumumanAktif} color="bg-pink-400" />
        </section>

        {/* Pengumuman */}
        {daftarPengumuman.length > 0 && (
          <section className="mb-10">
            <h3 className="text-xl font-bold text-green-700 mb-4">Pengumuman Aktif</h3>
            <div className="space-y-3">
              {daftarPengumuman.slice(0, 3).map((p) => (
                <Link key={p._id} href={`/dashboard-mahasiswa/pengumuman/${p._id}`} className="block bg-white p-4 rounded-lg shadow border border-pink-100 hover:bg-pink-50 transition">
                  <h4 className="text-lg font-semibold text-pink-800">{p.judul}</h4>
                  <p className="text-sm text-gray-500 mb-1">{new Date(p.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</p>
                  <p className="text-sm text-pink-700 italic">Klik untuk masuk ke pengumuman</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Kegiatan Saya */}
        <section>
          <h3 className="text-xl font-bold text-green-700 mb-4">Kegiatan yang Saya Ikuti</h3>
          <div className="space-y-3">
            {kegiatanSaya.length === 0 ? (
              <p className="text-gray-500 italic">Belum memilih kegiatan.</p>
            ) : (
              kegiatanSaya.slice(0, 5).map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow border border-green-100">
                  <h4 className="text-lg font-semibold text-green-800">{item.kegiatan?.nama}</h4>
                  <p className="text-sm text-gray-500">
                    {item.kegiatan?.tanggal
                      ? new Date(item.kegiatan.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })
                      : 'Tanpa tanggal'}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const menuLinks = [
  { href: '/dashboard-mahasiswa', label: 'Beranda', icon: <FaHome /> },
  { href: '/dashboard-mahasiswa/profil', label: 'Profil', icon: <FaUser /> },
  { href: '/dashboard-mahasiswa/kegiatan', label: 'Kegiatan', icon: <FaCalendarAlt /> },
];

function StatBox({ title, value, color }) {
  return (
    <div className={`p-5 rounded-xl shadow text-white flex items-center justify-between ${color}`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
