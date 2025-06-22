'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* ✅ Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/awan.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Optional overlay to darken the video */}
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>

      {/* ✅ Konten Di Atas Video */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="flex items-center justify-between py-4 px-6 bg-white/80 backdrop-blur-md shadow-md rounded-b-2xl">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-blue-600 shadow" />
            <h1 className="text-xl md:text-2xl font-extrabold text-blue-800 tracking-wide">UKM Info</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-blue-800 font-semibold text-sm">
            <button onClick={() => router.push('/login')} className="hover:text-blue-600 transition">Login</button>
            <button onClick={() => router.push('/contact')} className="hover:text-blue-600 transition">Kontak</button>
          </nav>

          <button className="md:hidden text-2xl text-blue-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow px-6 py-4 space-y-2 text-blue-700 font-semibold">
            <button onClick={() => { setIsMenuOpen(false); router.push('/login'); }}>Login</button><br />
            <button onClick={() => { setIsMenuOpen(false); router.push('/contact'); }}>Kontak</button>
          </div>
        )}

        {/* Konten Utama */}
        <main className="flex-grow flex items-center justify-center text-center px-6 py-24">
          <section className="animate-fade-in max-w-2xl">
            <img
              src="/logo.jpeg"
              alt="Logo UKM"
              className="mx-auto mb-6 w-24 h-24 object-cover rounded-full border-2 border-white shadow-lg"
            />

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide drop-shadow-xl">
              Sistem Informasi UKM
            </h2>

            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              Platform digital pengurus UKM<br />
              untuk manajemen kegiatan, inventaris, dan absensi.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:scale-105 transition"
              >
                Masuk ke Login
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="py-3 px-6 border border-white text-white hover:bg-white hover:text-blue-800 rounded-xl font-semibold shadow-md hover:scale-105 transition"
              >
                Lihat Halaman Kontak
              </button>
            </div>

            <p className="mt-10 text-xs text-gray-300 italic">
              Dibangun dengan Next.js, Tailwind CSS, dan MongoDB.
            </p>
          </section>
        </main>
      </div>

      {/* 🔁 Animasi Fade */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 1s ease-out both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
