'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DetailPengumuman() {
  const { id } = useParams();
  const router = useRouter();
  const [pengumuman, setPengumuman] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPengumuman = async () => {
      try {
        const res = await fetch(`/api/pengumuman/${id}`);
        if (!res.ok) throw new Error('Pengumuman tidak ditemukan atau terjadi kesalahan.');
        const data = await res.json();
        setPengumuman(data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, [id]);

  const handleBack = () => router.back();

  if (loading) {
    return (
      <div className="p-6 text-gray-600 text-center">
        Memuat detail pengumuman...
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center">
        ❌ {error}
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow mt-6">
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        {pengumuman.judul || 'Tanpa Judul'}
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(pengumuman.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <div className="text-gray-800 whitespace-pre-wrap">
        {pengumuman.isi || 'Isi pengumuman kosong.'}
      </div>

      <div className="mt-6">
        <button
          onClick={handleBack}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
}
