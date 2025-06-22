'use client';

import { useState, useEffect } from 'react';

export default function KelolaPengumuman() {
  const [pengumuman, setPengumuman] = useState([]);
  const [form, setForm] = useState({ judul: '', isi: '', tanggal: '', status: 'aktif' });

  useEffect(() => {
    fetch('/api/pengumuman')
      .then(res => res.json())
      .then(data => setPengumuman(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const newData = await res.json();
    setPengumuman([newData, ...pengumuman]);
    setForm({ judul: '', isi: '', tanggal: '', status: 'aktif' });
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Kelola Pengumuman</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input type="text" placeholder="Judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full p-2 border rounded" required />
        <textarea placeholder="Isi" value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} className="w-full p-2 border rounded" required />
        <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full p-2 border rounded" required />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded">
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Tambah</button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Daftar Pengumuman</h2>
        <ul className="space-y-2">
          {pengumuman.map((item, i) => (
            <li key={i} className="p-4 border rounded bg-white shadow">
              <h3 className="font-bold">{item.judul}</h3>
              <p>{item.isi}</p>
              <p className="text-sm text-gray-500">Tanggal: {new Date(item.tanggal).toLocaleDateString('id-ID')}</p>
              <span className={`text-sm px-2 py-1 rounded ${item.status === 'aktif' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
