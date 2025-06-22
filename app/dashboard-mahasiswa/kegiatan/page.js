'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function KegiatanMahasiswaPage() {
  const { data: session, status } = useSession();
  const [daftarPilihan, setDaftarPilihan] = useState([]);
  const [kegiatanSaya, setKegiatanSaya] = useState([]);
  const [formData, setFormData] = useState({ kegiatanId: '' });
  const [loading, setLoading] = useState(true);

  const fetchPilihanKegiatan = async () => {
    try {
      const res = await fetch('/api/kegiatan');
      const data = await res.json();
      setDaftarPilihan(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil daftar kegiatan:', err);
    }
  };

  const fetchKegiatanSaya = async () => {
    try {
      const res = await fetch('/api/kegiatan-mahasiswa');
      const data = await res.json();
      setKegiatanSaya(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil kegiatan saya:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kegiatanId) return;

    try {
      const res = await fetch('/api/kegiatan-mahasiswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ kegiatanId: '' });
        fetchKegiatanSaya();
      } else {
        const err = await res.json();
        alert(err.message || 'Gagal menyimpan kegiatan.');
      }
    } catch (err) {
      console.error('Gagal menyimpan kegiatan:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;

    try {
      const res = await fetch(`/api/kegiatan-mahasiswa/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchKegiatanSaya();
      } else {
        const err = await res.json();
        alert(err.message || 'Gagal menghapus kegiatan.');
      }
    } catch (err) {
      console.error('Gagal menghapus kegiatan:', err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPilihanKegiatan();
      fetchKegiatanSaya();
    }
  }, [status]);

  if (status === 'loading') return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-800">Kegiatan Saya</h1>
          <button
            onClick={() => window.history.back()}
            className="text-sm text-green-600 hover:text-green-800 transition"
          >
            ← Kembali
          </button>
        </div>

        {/* Form Pilih Kegiatan */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 border border-green-200 space-y-5 mb-10"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kegiatan</label>
            <select
              value={formData.kegiatanId}
              onChange={(e) => setFormData({ ...formData, kegiatanId: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-green-400"
            >
              <option value="" disabled>
                -- Pilih Kegiatan --
              </option>
              {daftarPilihan.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.nama} ({new Date(item.tanggal).toLocaleDateString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Simpan Kegiatan
          </button>
        </form>

        {/* Daftar Kegiatan yang Sudah Dipilih */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600 italic">Memuat kegiatan...</p>
          ) : kegiatanSaya.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada kegiatan yang diinput.</p>
          ) : (
            kegiatanSaya.map((item, i) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-green-100 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-1">
                    {item.kegiatan?.nama}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.kegiatan?.tanggal
                      ? new Date(item.kegiatan.tanggal).toLocaleDateString('id-ID')
                      : 'Tanpa tanggal'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-sm text-red-600 hover:text-red-800 border border-red-300 px-3 py-1 rounded-md transition"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
