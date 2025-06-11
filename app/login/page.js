'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan status login sementara
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', data.role);
        localStorage.setItem('nama', data.nama);
        localStorage.setItem('userId', data.id);

        setMessage('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          const role = data.role.toLowerCase();
          if (role === 'admin') {
            router.push('/dashboard-admin');
          } else if (role === 'mhs') {
            router.push('/dashboard-mahasiswa');
          } else if (role === 'pengurus') {
            router.push('/dashboard-pengurus');
          } else {
            setMessage('Peran tidak dikenali.');
          }
        }, 1000);
      } else {
        setMessage(data.message || 'Login gagal.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">UKM Info System</h1>
          <p className="text-gray-500">Login All Role</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-gray-700 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-700 select-none">{message}</p>
        )}

        {/* Link ke halaman register */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
