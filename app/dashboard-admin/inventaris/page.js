'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageInventaris() {
  const router = useRouter();
  const [inventaris, setInventaris] = useState([]);
  const [form, setForm] = useState({ nama: '', jumlah: '', kondisi: 'Baik' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/api/inventaris')
      .then(res => res.json())
      .then(setInventaris)
      .catch(console.error);
  }, []);

  const resetForm = () => {
    setForm({ nama: '', jumlah: '', kondisi: 'Baik' });
    setEditingId(null);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = async () => {
    if (!form.nama || form.jumlah === '') return alert('Nama dan jumlah wajib diisi!');
    if (isNaN(form.jumlah) || Number(form.jumlah) < 0) return alert('Jumlah harus angka positif!');

    const newItem = {
      nama: form.nama,
      jumlah: Number(form.jumlah),
      kondisi: form.kondisi,
    };

    if (editingId) {
      // UPDATE
      const res = await fetch(`/api/inventaris/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const updated = await res.json();

      setInventaris(inventaris.map(i => (i._id === editingId ? updated : i)));
    } else {
      // CREATE
      const res = await fetch('/api/inventaris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      setInventaris([data, ...inventaris]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus barang ini?')) return;

    await fetch('/api/inventaris', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    setInventaris(inventaris.filter(i => i._id !== id));
    resetForm();
  };

  const handleEdit = (item) => {
    setForm({ nama: item.nama, jumlah: item.jumlah, kondisi: item.kondisi });
    setEditingId(item._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-indigo-900">Manajemen Inventaris Barang</h1>
        <button
          onClick={() => router.push('/dashboard-admin')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          &larr; Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Inventaris' : 'Tambah Inventaris Baru'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Barang (contoh: Kamera)"
            value={form.nama}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900 placeholder-gray-500"
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah Barang"
            value={form.jumlah}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900 placeholder-gray-500"
          />
          <select
            name="kondisi"
            value={form.kondisi}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900"
          >
            <option value="Baik">Baik</option>
            <option value="Rusak">Rusak</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={handleAddOrEdit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              {editingId ? 'Simpan Perubahan' : 'Tambah Barang'}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daftar Inventaris</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-900">
          <thead className="bg-indigo-100 text-gray-900">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Nama Barang</th>
              <th className="px-4 py-2 text-left font-medium">Jumlah</th>
              <th className="px-4 py-2 text-left font-medium">Kondisi</th>
              <th className="px-4 py-2 text-left font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventaris.map(item => (
              <tr key={item._id} className="hover:bg-indigo-50">
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.jumlah}</td>
                <td className="px-4 py-3">{item.kondisi}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {inventaris.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
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
