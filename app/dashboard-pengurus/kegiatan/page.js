'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function KegiatanPage() {
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kegiatanList, setKegiatanList] = useState([]);

  // Ambil data kegiatan dari database
  const fetchKegiatan = async () => {
    const res = await fetch('/api/kegiatan');
    const data = await res.json();
    setKegiatanList(data);
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  // Simpan kegiatan baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/kegiatan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, tanggal }),
    });
    if (res.ok) {
      setNama('');
      setTanggal('');
      fetchKegiatan();
    }
  };

  // Hapus kegiatan
  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus kegiatan ini?')) {
      await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' });
      fetchKegiatan();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
      {/* Header dengan Tombol Kembali */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kegiatan UKM</h1>
        <Link
          href="/dashboard-pengurus"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-5 mb-10 border border-gray-200">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nama Kegiatan</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Contoh: Seminar Nasional"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
        >
          Simpan Kegiatan
        </button>
      </form>

      {/* Tabel Kegiatan */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 border">Nama Kegiatan</th>
              <th className="p-3 border">Tanggal</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanList.map((kegiatan, index) => (
              <tr
                key={kegiatan._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="p-3 border">{kegiatan.nama}</td>
                <td className="p-3 border">{kegiatan.tanggal}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => handleDelete(kegiatan._id)}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {kegiatanList.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  Belum ada kegiatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
