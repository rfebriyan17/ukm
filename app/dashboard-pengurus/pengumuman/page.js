'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PengumumanPage() {
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [pengumumanList, setPengumumanList] = useState([]);

  const fetchPengumuman = async () => {
    const res = await fetch('/api/pengumuman');
    const data = await res.json();
    setPengumumanList(data);
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, isi, tanggal }),
    });

    if (res.ok) {
      setJudul('');
      setIsi('');
      setTanggal('');
      fetchPengumuman();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus pengumuman ini?')) {
      await fetch(`/api/pengumuman/${id}`, { method: 'DELETE' });
      fetchPengumuman();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengumuman</h1>
        <Link
          href="/dashboard-pengurus"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-md rounded-lg p-6 space-y-4 mb-10"
      >
        <div>
          <label className="block font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600"
            placeholder="Contoh: Rapat UKM"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Isi</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            rows="4"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600"
            placeholder="Isi pengumuman..."
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Simpan Pengumuman
        </button>
      </form>

      {/* Tabel Pengumuman */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 border">Judul</th>
              <th className="p-3 border">Isi</th>
              <th className="p-3 border">Tanggal</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengumumanList.map((item) => (
              <tr key={item._id} className="even:bg-gray-50">
                <td className="p-3 border">{item.judul}</td>
                <td className="p-3 border">{item.isi}</td>
                <td className="p-3 border">
                  {item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {pengumumanList.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada pengumuman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
