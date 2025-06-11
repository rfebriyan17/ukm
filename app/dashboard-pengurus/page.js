'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPengurusPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log('📌 Role dari localStorage:', role);

    if (!role || role.toLowerCase() !== 'pengurus') {
      console.warn('⛔ Role tidak valid atau bukan pengurus. Arahkan ke login.');
      router.push('/login');
    } else {
      console.log('✅ Role valid: Pengurus');
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <p className="text-indigo-600 text-lg font-semibold">Memuat dashboard pengurus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-700 shadow-md py-5 px-8 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold tracking-wide">Dashboard Pengurus</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Selamat datang, Pengurus!</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Ini adalah halaman dashboard khusus pengurus. Di sini Anda dapat mengelola data kegiatan,
            melihat jadwal, dan memantau informasi organisasi.
          </p>
        </div>
      </main>
    </div>
  );
}
