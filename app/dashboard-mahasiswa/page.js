'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardMhs() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const namaUser = localStorage.getItem('nama');

    if (!isLoggedIn || role !== 'mhs') {
      router.push('/login');
    } else {
      setNama(namaUser);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-600 text-lg font-semibold">Memuat dashboard mahasiswa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-800 shadow-md py-5 px-8 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold tracking-wide">UKM Info System - Mahasiswa</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h2 className="text-3xl font-semibold text-green-900 mb-4">
            Selamat Datang, {nama} 🎉
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Anda berhasil login sebagai mahasiswa. Gunakan fitur ini untuk melihat info UKM dan kegiatan yang tersedia.
          </p>

          {/* Contoh fitur atau menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-green-100 rounded-lg p-6 text-green-900 shadow hover:shadow-lg cursor-pointer transition">
              <h3 className="text-xl font-semibold mb-2">Info UKM</h3>
              <p>Jelajahi berbagai Unit Kegiatan Mahasiswa yang aktif.</p>
            </div>
            <div className="bg-green-100 rounded-lg p-6 text-green-900 shadow hover:shadow-lg cursor-pointer transition">
              <h3 className="text-xl font-semibold mb-2">Kegiatan & Event</h3>
              <p>Lihat jadwal dan informasi kegiatan UKM terbaru.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
