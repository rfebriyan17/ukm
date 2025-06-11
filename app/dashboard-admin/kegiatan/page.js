'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageKegiatan() {
  const router = useRouter();
  const [kegiatan, setKegiatan] = useState([]);
  const [form, setForm] = useState({ nama: '', tanggal: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/api/kegiatan')
      .then(res => res.json())
      .then(data => setKegiatan(data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.nama || !form.tanggal) return alert('Semua field wajib diisi!');
    const res = await fetch('/api/kegiatan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newKegiatan = await res.json();
    setKegiatan([...kegiatan, newKegiatan]);
    setForm({ nama: '', tanggal: '' });
  };

  const handleEdit = item => {
    setEditingId(item._id);
    setForm({ nama: item.nama, tanggal: item.tanggal });
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/kegiatan/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setKegiatan(kegiatan.map(k => (k._id === editingId ? updated : k)));
    setEditingId(null);
    setForm({ nama: '', tanggal: '' });
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus kegiatan ini?')) {
      await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' });
      setKegiatan(kegiatan.filter(k => k._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 md:ml-64 text-gray-800">
      <h1 className="text-2xl font-semibold text-indigo-900 mb-6">Kelola Kegiatan</h1>

      <button
        onClick={() => router.push('/dashboard-admin')}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        &larr; Kembali ke Dashboard
      </button>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
        </h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Kegiatan"
            value={form.nama}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px] text-gray-800 placeholder:text-gray-400"
          />
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-800"
          />
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ nama: '', tanggal: '' });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Tambah
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Daftar Kegiatan</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                Nama Kegiatan
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {kegiatan.map(({ _id, nama, tanggal }) => (
              <tr key={_id} className="hover:bg-indigo-50">
                <td className="px-6 py-4">{nama}</td>
                <td className="px-6 py-4">{tanggal}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit({ _id, nama, tanggal })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {kegiatan.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  Tidak ada data kegiatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
