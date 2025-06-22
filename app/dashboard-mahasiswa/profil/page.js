'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function ProfilMhs() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.avatar) {
      setPreview(session.user.avatar);
    }
  }, [status, session, router]);

  const handleBack = () => router.back();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !session?.user?.username) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', session.user.username);

    try {
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        // Ambil avatar baru dari DB
        const refresh = await fetch('/api/refresh-session');
        const data = await refresh.json();

        if (data?.avatar) {
          await updateSession(); // ✅ refresh session NextAuth
          setPreview(data.avatar); // ✅ update tampilan avatar
          setFile(null);
          alert('Foto berhasil diunggah!');
        }
      } else {
        alert(result.message || 'Upload gagal');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-green-700">
        Memuat data profil...
      </div>
    );
  }

  const user = session?.user || {};
  const avatarSrc =
    preview ||
    user.avatar ||
    `https://ui-avatars.com/api/?name=${user.nama || 'Mahasiswa'}&background=34d399&color=fff&rounded=true`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 relative border border-green-100">
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center text-green-700 hover:text-green-900 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Kembali</span>
        </button>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-28 h-28 rounded-full border-4 border-green-400 shadow-md overflow-hidden mb-4 transition-transform duration-300 hover:scale-105">
            <img src={avatarSrc} alt="Avatar" className="object-cover w-full h-full" />
          </div>

          <label
            htmlFor="uploadFoto"
            className="cursor-pointer text-green-700 hover:underline text-sm font-medium mb-2"
          >
            {file ? 'Foto dipilih, klik "Upload Foto"' : 'Ubah Foto'}
          </label>
          <input
            id="uploadFoto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <button
              onClick={handleUpload}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full transition mt-2"
            >
              Upload Foto
            </button>
          )}

          <h1 className="text-3xl font-extrabold text-green-900 mt-4">Profil Mahasiswa</h1>
          <p className="text-gray-500 mt-1 text-sm">Informasi akun mahasiswa aktif</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
          <InfoField label="Nama Lengkap" value={user.nama} />
          <InfoField label="Username" value={user.username} />
          <InfoField label="Peran (Role)" value={user.role} isCapitalize />
          <InfoField label="Status Akun" value={user.status || 'Aktif'} />
        </div>

        <div className="mt-10 pt-4 text-sm text-center border-t text-gray-500 italic">
          Jika terdapat kesalahan data, silakan hubungi admin UKM.
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, isCapitalize }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className={`text-green-900 font-semibold ${isCapitalize ? 'capitalize' : ''}`}>
        {value || '-'}
      </p>
    </div>
  );
}
