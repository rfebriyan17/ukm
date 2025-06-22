'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function DashboardAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ukmData, setUkmData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [kegiatanData, setKegiatanData] = useState([]);
  const [inventarisData, setInventarisData] = useState([]);
  const [pengumumanData, setPengumumanData] = useState([]);

  const [judulPengumuman, setJudulPengumuman] = useState('');
  const [isiPengumuman, setIsiPengumuman] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/login');
    } else {
      setNama(session.user.name || 'Admin');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, pengumumanRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/pengumuman'),
        ]);
        const dashboard = await dashboardRes.json();
        const pengumuman = await pengumumanRes.json();

        setStats([
          { id: 1, title: 'Jumlah UKM', value: dashboard.jumlahUKM, icon: '📚' },
          { id: 2, title: 'Jumlah Mahasiswa', value: dashboard.jumlahMahasiswa, icon: '👩‍🎓' },
          { id: 3, title: 'Kegiatan Hari Ini', value: dashboard.kegiatanHariIni, icon: '📅' },
          { id: 4, title: 'Laporan Bulanan', value: dashboard.laporanBulanan.length, icon: '📊' },
          { id: 5, title: 'Pengumuman Aktif', value: dashboard.pengumumanAktif || 0, icon: '📢' },
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const formattedChart = monthNames.map((name, index) => {
          const found = dashboard.laporanBulanan.find(item => item._id === index + 1);
          return { name, Aktivitas: found ? found.count : 0 };
        });

        setChartData(formattedChart);
        setUkmData(dashboard.daftarUKM);
        setUserData(dashboard.daftarUsers);
        setKegiatanData(dashboard.daftarKegiatan);
        setInventarisData(dashboard.daftarInventaris);
        setPengumumanData(pengumuman.filter(p => p.status === 'aktif'));
        setIsLoading(false);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => signOut({ callbackUrl: '/login' });

  const handleSubmitPengumuman = async (e) => {
    e.preventDefault();
    if (!judulPengumuman || !isiPengumuman) return;
    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul: judulPengumuman, isi: isiPengumuman, status: 'aktif' }),
    });
    if (res.ok) {
      setJudulPengumuman('');
      setIsiPengumuman('');
    }
  };

  const handleDeletePengumuman = async (id) => {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
    const res = await fetch(`/api/pengumuman/${id}`, { method: 'DELETE' });
    if (res.ok) location.reload();
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard-admin' },
    { label: 'Users', path: '/dashboard-admin/users' },
    { label: 'Kegiatan', path: '/dashboard-admin/kegiatan' },
    { label: 'Inventaris', path: '/dashboard-admin/inventaris' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-indigo-600 text-lg font-semibold">Memuat dashboard admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* NAVBAR */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="text-red-600 font-bold text-xl">UKM Info</div>

          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span className={`px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer ${
                  pathname === item.path ? 'bg-red-600 text-white' : 'text-gray-700 hover:text-red-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
          >
            <FaSignOutAlt /> Logout
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-red-600 text-xl">
            <FaBars />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path} onClick={() => setMenuOpen(false)}>
                <span className={`block px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer ${
                  pathname === item.path ? 'bg-red-600 text-white' : 'text-gray-700 hover:text-red-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm w-fit"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-screen-xl mx-auto p-6 space-y-10">
        {/* STATISTIK */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map(({ id, title, value, icon }) => (
            <div key={id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4 hover:shadow-md transition">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-bold text-indigo-900">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* GRAFIK */}
        <section className="bg-white rounded-lg shadow p-6">
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

        {/* FORM PENGUMUMAN */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Tambah Pengumuman</h2>
          <form onSubmit={handleSubmitPengumuman} className="space-y-4">
            <input
              type="text"
              value={judulPengumuman}
              onChange={(e) => setJudulPengumuman(e.target.value)}
              placeholder="Judul Pengumuman"
              className="w-full px-4 py-2 border border-indigo-300 rounded"
              required
            />
            <textarea
              value={isiPengumuman}
              onChange={(e) => setIsiPengumuman(e.target.value)}
              placeholder="Isi Pengumuman"
              rows="4"
              className="w-full px-4 py-2 border border-indigo-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Simpan Pengumuman
            </button>
          </form>
        </section>

        {/* TABEL */}
        <DataTable title="Daftar UKM" columns={['Nama UKM']} data={ukmData.map(d => [d.nama])} />
        <DataTable title="Daftar Users" columns={['Username', 'Nama', 'Role', 'Status']} data={userData.map(u => [u.username, u.nama || '-', u.role, u.status || '-'])} />
        <DataTable title="Daftar Kegiatan" columns={['Nama Kegiatan', 'Tanggal']} data={kegiatanData.map(k => [k.nama, new Date(k.tanggal).toLocaleDateString('id-ID')])} />
        <DataTable title="Daftar Inventaris" columns={['Nama Barang', 'Jumlah', 'Kondisi']} data={inventarisData.map(i => [i.nama, i.jumlah, i.kondisi])} />
        <DataTablePengumuman title="Pengumuman Aktif" columns={['Judul', 'Isi', 'Tanggal', 'Aksi']} data={pengumumanData} onDelete={handleDeletePengumuman} />
      </main>
    </div>
  );
}

// Reuse tabel
function DataTable({ title, columns, data }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-indigo-900 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>{columns.map((col) => <th key={col} className="px-6 py-3 text-left text-sm font-medium text-indigo-900">{col}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-indigo-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-indigo-900">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataTablePengumuman({ title, columns, data, onDelete }) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-indigo-900 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-100">
            <tr>{columns.map((col, i) => <th key={i} className="px-6 py-3 text-left text-sm font-medium text-indigo-900">{col}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4 text-indigo-900">{p.judul}</td>
                <td className="px-6 py-4 text-indigo-900">{p.isi}</td>
                <td className="px-6 py-4 text-indigo-900">{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
