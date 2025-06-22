'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InventarisPage() {
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [inventarisList, setInventarisList] = useState([]);

  const fetchData = async () => {
    const res = await fetch('/api/inventaris');
    const data = await res.json();
    setInventarisList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/inventaris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, jumlah: Number(jumlah), kondisi }),
    });
    if (res.ok) {
      setNama('');
      setJumlah('');
      setKondisi('');
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      await fetch('/api/inventaris', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Inventaris UKM</h1>
        <Link
          href="/dashboard-pengurus"
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition font-semibold"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 mb-10 border border-gray-200 space-y-5"
      >
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Nama Inventaris</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Contoh: Proyektor"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Jumlah</label>
          <input
            type="number"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Contoh: 3"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Kondisi</label>
          <select
            value={kondisi}
            onChange={(e) => setKondisi(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          >
            <option value="">-- Pilih Kondisi --</option>
            <option value="Baik">Baik</option>
            <option value="Rusak">Rusak</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow"
        >
          Tambah Inventaris
        </button>
      </form>

      {/* Tabel Data */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Jumlah</th>
              <th className="p-3 border">Kondisi</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {inventarisList.map((item, index) => (
              <tr
                key={item._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="p-3 border">{item.nama}</td>
                <td className="p-3 border">{item.jumlah}</td>
                <td className="p-3 border">{item.kondisi}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {inventarisList.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada data inventaris.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
