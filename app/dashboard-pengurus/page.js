'use client';

import { useEffect, useState } from 'react';
import {
  FaBars, FaUsers, FaClipboardList, FaBullhorn, FaBoxOpen, FaSignOutAlt,
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function DashboardPengurus() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statistik, setStatistik] = useState({
    totalKegiatan: 0,
    totalInventaris: 0,
    totalAbsensi: 0,
    totalPengumuman: 0,
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStatistik({
          totalKegiatan: data.daftarKegiatan?.length || 0,
          totalInventaris: data.daftarInventaris?.length || 0,
          totalAbsensi: data.jumlahAbsensi || 0,
          totalPengumuman: data.pengumumanAktif || 0,
        });
      })
      .catch((err) => {
        console.error('Gagal memuat data statistik:', err);
      });
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); // ✅ arahkan ke /login
  };

  const chartData = {
    labels: ['Kegiatan', 'Inventaris', 'Pengumuman', 'Absensi'],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          statistik.totalKegiatan,
          statistik.totalInventaris,
          statistik.totalPengumuman,
          statistik.totalAbsensi,
        ],
        backgroundColor: ['#22c55e', '#3b82f6', '#facc15', '#ef4444'],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#374151' } },
      title: {
        display: true,
        text: 'Statistik Data UKM',
        color: '#1f2937',
        font: { size: 20, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { beginAtZero: true, ticks: { color: '#374151' } },
    },
  };

  const navLinks = [
    { href: '/dashboard-pengurus', label: 'Beranda' },
    { href: '/dashboard-pengurus/kegiatan', label: 'Kegiatan' },
    { href: '/dashboard-pengurus/absensi', label: 'Absensi' },
    { href: '/dashboard-pengurus/inventaris', label: 'Inventaris' },
    { href: '/dashboard-pengurus/pengumuman', label: 'Pengumuman' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 font-sans">
      {/* Top Navbar Desktop */}
      <header className="hidden md:flex items-center justify-between px-10 py-4 bg-white shadow-md">
        <div className="text-red-600 font-bold text-2xl tracking-wide">UKM Info</div>
        <nav className="flex space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-t-lg font-medium transition ${
                pathname === link.href
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-full"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </header>

      {/* Sidebar Mobile */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg p-6 w-64 transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="text-xl font-bold text-red-600 mb-6">UKM Info System</div>
        <nav className="space-y-4 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block hover:text-red-600">
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 mt-6 flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="text-2xl text-red-600">
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
      </div>

      {/* Main Content */}
      <main className="p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-6">Dashboard Pengurus UKM</h2>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatBox title="Kegiatan" value={statistik.totalKegiatan} color="green" icon={<FaClipboardList />} />
          <StatBox title="Inventaris" value={statistik.totalInventaris} color="blue" icon={<FaBoxOpen />} />
          <StatBox title="Pengumuman" value={statistik.totalPengumuman} color="yellow" icon={<FaBullhorn />} />
          <StatBox title="Absensi" value={statistik.totalAbsensi} color="red" icon={<FaUsers />} />
        </div>

        {/* Grafik */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
}

function StatBox({ title, value, color, icon }) {
  const bgColor = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  const iconColor = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
  };

  return (
    <div className={`flex items-center justify-between p-5 rounded-xl shadow-md ${bgColor[color]}`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`text-3xl ${iconColor[color]}`}>{icon}</div>
    </div>
  );
}
