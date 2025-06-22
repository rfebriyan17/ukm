'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res.ok) {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role?.toLowerCase();

        setMessage('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          if (role === 'admin') router.push('/dashboard-admin');
          else if (role === 'mhs') router.push('/dashboard-mahasiswa');
          else if (role === 'pengurus') router.push('/dashboard-pengurus');
          else setMessage('Peran tidak dikenali.');
        }, 1000);
      } catch (err) {
        setMessage('Gagal mengambil data sesi.');
      }
    } else {
      setMessage('Login gagal. Username atau password salah.');
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/kampus.jpeg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-2 tracking-wide">
            UKM Information System
          </h1>
          <p className="text-sm text-gray-600">Login untuk semua peran pengguna</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="mt-4 text-sm text-center text-gray-600 leading-relaxed">
          <span className="block">
            Gunakan akun default <span className="font-semibold">Admin</span>: 
            <span className="ml-1 font-medium">admin / admin123</span>
          </span>
          <span className="block">
            Akun <span className="font-semibold">Mahasiswa</span>: 
            <span className="ml-1 font-medium">mahasiswa / mhs123</span>
          </span>
          <span className="block">
            Akun <span className="font-semibold">Pengurus</span>: 
            <span className="ml-1 font-medium">pengurus / pengurus123</span>
          </span>
        </p>

        {/* ✅ Ganti dengan Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Daftar di sini
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-gray-600 hover:underline"
        >
          ← Kembali ke Menu Utama
        </Link>
      </div>
    </div>
  );
}
