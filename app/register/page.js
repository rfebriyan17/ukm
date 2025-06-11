'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: '',
    role: 'mhs',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registrasi berhasil! Silakan login.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setMessage(data.message || 'Registrasi gagal.');
      }
    } catch (error) {
      console.error('Register error:', error);
      setMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">Registrasi UKM</h1>
          <p className="text-gray-500">Buat akun baru sebagai Mahasiswa atau Pengurus</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block mb-2 text-gray-700 font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <label htmlFor="username" className="block mb-2 text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Masukkan password"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-2 text-gray-700 font-medium">Daftar sebagai</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            >
              <option value="mhs">Mahasiswa</option>
              <option value="pengurus">Pengurus UKM</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isSubmitting
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-700 select-none">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <a href="/login" className="text-green-600 hover:underline">Login di sini</a>
        </p>
      </div>
    </div>
  );
}
