'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">UKM Info System - Admin</h1>
      </header>

      <main className="p-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Selamat Datang, Admin 🎉</h2>
          <p className="text-gray-600 mb-6">
            Anda berhasil login ke sistem informasi UKM Mahasiswa. Silakan gunakan menu untuk mengelola data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-indigo-100 p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-indigo-700">Data UKM</h3>
              <p className="text-sm text-gray-600">Kelola unit kegiatan mahasiswa</p>
            </div>
            <div className="bg-indigo-100 p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-indigo-700">Kegiatan</h3>
              <p className="text-sm text-gray-600">Tambah atau edit kegiatan UKM</p>
            </div>
            <div className="bg-indigo-100 p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-indigo-700">Anggota</h3>
              <p className="text-sm text-gray-600">Manajemen keanggotaan mahasiswa</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
