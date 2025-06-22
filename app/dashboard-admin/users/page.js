'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    nama: '',
    password: '',
    role: 'user',
    status: 'Aktif',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.username || !form.password || !form.role) {
      return alert('Username, password, dan role wajib diisi!');
    }

    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ username: '', nama: '', password: '', role: 'user', status: 'Aktif' });
      fetchUsers();
    }
  };

  const handleEdit = user => {
    setEditingId(user._id);
    setForm({
      username: user.username,
      nama: user.nama || '',
      password: '',
      role: user.role,
      status: user.status || 'Aktif',
    });
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/users/${editingId}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditingId(null);
      setForm({ username: '', nama: '', password: '', role: 'user', status: 'Aktif' });
      fetchUsers();
    }
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-2xl font-semibold text-indigo-900 mb-6">Kelola Users</h1>
      <button
        onClick={() => router.push('/dashboard-admin')}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        &larr; Kembali ke Dashboard
      </button>

      {/* Form Tambah/Edit */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit User' : 'Tambah User'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (kosongkan jika tidak diubah)"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="pengurus">Pengurus</option>
            <option value="mhs">Mahasiswa</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>

        <div className="mt-4 space-x-2">
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
                  setForm({
                    username: '',
                    nama: '',
                    password: '',
                    role: 'user',
                    status: 'Aktif',
                  });
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

      {/* Daftar User */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Daftar Users</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-indigo-900">Username</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-indigo-900">Nama</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-indigo-900">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-indigo-900">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-indigo-900">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {users.map(({ _id, username, nama, role, status }) => (
              <tr key={_id} className="hover:bg-indigo-50">
                <td className="px-4 py-2">{username}</td>
                <td className="px-4 py-2">{nama || '-'}</td>
                <td className="px-4 py-2 capitalize">{role}</td>
                <td className="px-4 py-2">{status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit({ _id, username, nama, role, status })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
