'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardAdmin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ukmData, setUkmData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [kegiatanData, setKegiatanData] = useState([]);
  const [inventarisData, setInventarisData] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const namaUser = localStorage.getItem('nama');

    if (!isLoggedIn || role !== 'admin') {
      router.push('/login');
    } else {
      setNama(namaUser || 'Admin');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();

        // Data statistik
        setStats([
          { id: 1, title: 'Jumlah UKM', value: data.jumlahUKM, icon: '📚' },
          { id: 2, title: 'Jumlah Mahasiswa', value: data.jumlahMahasiswa, icon: '👩‍🎓' },
          { id: 3, title: 'Kegiatan Hari Ini', value: data.kegiatanHariIni, icon: '📅' },
          { id: 4, title: 'Laporan Bulanan', value: data.laporanBulanan.length, icon: '📊' },
        ]);

        // Data grafik aktivitas bulanan
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const formattedChart = monthNames.map((name, index) => {
          const found = data.laporanBulanan.find(item => item._id === index + 1);
          return { name, Aktivitas: found ? found.count : 0 };
        });

        setChartData(formattedChart);

        // Set data untuk tabel
        setUkmData(data.daftarUKM);
        setUserData(data.daftarUsers);
        setKegiatanData(data.daftarKegiatan);
        setInventarisData(data.daftarInventaris);
        setIsLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-indigo-600 text-lg font-semibold">Memuat dashboard admin...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 bg-indigo-900 text-white w-64 px-6 py-8 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex-shrink-0`}>
        <h2 className="text-3xl font-bold mb-10">UKM Admin</h2>
        <nav className="space-y-4">
          {[
            { label: 'Dashboard', path: '/dashboard-admin' },
            { label: 'Kelola Users', path: '/dashboard-admin/users' },
            { label: 'Kelola Kegiatan', path: '/dashboard-admin/kegiatan' },
            { label: 'Kelola Inventaris', path: '/dashboard-admin/inventaris' },
          ].map(({ label, path }) => (
            <button key={label} onClick={() => { setSidebarOpen(false); router.push(path); }} className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-700 transition">
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Konten */}
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4 sticky top-0 z-30">
          <button className="md:hidden text-indigo-900 text-2xl font-bold" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className="text-xl font-semibold text-indigo-900">Dashboard Admin UKM</h1>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-indigo-900">Halo, {nama}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition">
              Logout
            </button>
          </div>
        </header>

        <main className="p-8 overflow-auto">
          {/* Statistik */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map(({ id, title, value, icon }) => (
              <div key={id} className="bg-white rounded-lg shadow p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl">{icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{title}</p>
                  <p className="text-2xl font-bold text-indigo-900">{value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Grafik */}
          <section className="bg-white rounded-lg shadow p-6 mb-10">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Aktivitas UKM Per Bulan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#4C51BF" />
                <YAxis stroke="#4C51BF" />
                <Tooltip />
                <Bar dataKey="Aktivitas" fill="#5A67D8" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* Daftar Tabel */}
          <DataTable title="Daftar UKM" columns={['Nama UKM']} data={ukmData.map(d => [d.nama])} />
          <DataTable title="Daftar Users" columns={['Username', 'Role']} data={userData.map(u => [u.username, u.role === 'admin' ? 'Admin' : u.role === 'mhs' ? 'Mahasiswa' : u.role])} />
          <DataTable title="Daftar Kegiatan" columns={['Nama Kegiatan', 'Tanggal']} data={kegiatanData.map(k => [k.nama, new Date(k.tanggal).toLocaleDateString('id-ID')])} />
          <DataTable title="Daftar Inventaris" columns={['Nama Barang', 'Jumlah', 'Kondisi']} data={inventarisData.map(i => [i.nama, i.jumlah, i.kondisi])} />
        </main>

        <footer className="bg-white text-center text-gray-500 text-sm py-4">
          &copy; 2025 UKM Info System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// Komponen reusable untuk menampilkan tabel
function DataTable({ title, columns, data }) {
  return (
    <section className="bg-white rounded-lg shadow p-6 mb-10">
      <h2 className="text-xl font-semibold text-indigo-900 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-left text-sm font-medium text-indigo-900">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-indigo-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap text-indigo-900">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
