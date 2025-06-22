'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AbsensiPage() {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState('');
  const [userList, setUserList] = useState([]);
  const [absensi, setAbsensi] = useState({}); // { userId: true/false }

  // Ambil data kegiatan & user saat page load
  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setKegiatanList(data.daftarKegiatan || []);
        setUserList(data.daftarUsers?.filter((u) => u.role === 'mhs') || []);
      });
  }, []);

  // Ambil data absensi jika kegiatan dipilih
  useEffect(() => {
    if (selectedKegiatan) {
      fetch(`/api/absensi?kegiatanId=${selectedKegiatan}`)
        .then((res) => res.json())
        .then((data) => {
          const initialAbsensi = {};
          data.forEach((item) => {
            initialAbsensi[item.userId] = item.hadir;
          });
          setAbsensi(initialAbsensi);
        });
    } else {
      setAbsensi({});
    }
  }, [selectedKegiatan]);

  // Toggle centang hadir
  const handleCheck = (userId) => {
    setAbsensi((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Kirim absensi ke backend (POST/UPDATE)
  const handleSubmit = async () => {
    if (!selectedKegiatan) {
      alert('Silakan pilih kegiatan terlebih dahulu!');
      return;
    }

    const payload = Object.keys(absensi).map((userId) => ({
      userId,
      kegiatanId: selectedKegiatan,
      hadir: absensi[userId],
    }));

    for (const data of payload) {
      await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    alert('Absensi berhasil disimpan!');
  };

  // Hapus absensi 1 user dari kegiatan
  const handleDelete = async (userId) => {
    if (!confirm('Yakin ingin menghapus absensi ini?')) return;
    await fetch('/api/absensi', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, kegiatanId: selectedKegiatan }),
    });
    setAbsensi((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Absensi Kegiatan</h1>
        <Link
          href="/dashboard-pengurus"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Dropdown Pilih Kegiatan */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">Pilih Kegiatan:</label>
        <select
          value={selectedKegiatan}
          onChange={(e) => setSelectedKegiatan(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Pilih Kegiatan --</option>
          {kegiatanList.map((k) => (
            <option key={k._id} value={k._id}>
              {k.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Absensi */}
      {selectedKegiatan && (
        <>
          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">Nama Mahasiswa</th>
                  <th className="px-4 py-2 border text-center">Hadir?</th>
                  <th className="px-4 py-2 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{user.nama}</td>
                    <td className="px-4 py-2 border text-center">
                      <input
                        type="checkbox"
                        checked={!!absensi[user._id]}
                        onChange={() => handleCheck(user._id)}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tombol Simpan */}
          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
          >
            Simpan Absensi
          </button>
        </>
      )}
    </div>
  );
}
