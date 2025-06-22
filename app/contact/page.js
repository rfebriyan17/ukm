'use client';

import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 py-10"
      style={{ backgroundImage: "url('/kampus.jpeg')" }} // Gambar background dari folder /public
    >
      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-4xl animate-fade-in space-y-12">

        {/* Bagian Kontak UKM */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b border-blue-300 pb-2">📌 Kontak UKM</h2>
          <ul className="text-gray-800 space-y-2 text-sm md:text-base">
            <li><strong>📍 Alamat Sekretariat:</strong> Gedung Serbaguna Lt. 2, Kampus Universitas Rizki</li>
            <li><strong>📞 Telepon:</strong> (022) 1234-5678</li>
            <li><strong>📧 Email UKM:</strong> ukm.mahasiswa@universitasrizki.ac.id</li>
            <li><strong>⏰ Jam Operasional:</strong> Senin–Jumat, 09.00–16.00 WIB</li>
          </ul>
        </section>

        {/* Tombol kembali */}
        <div className="text-center pt-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:bg-blue-800 transition-all hover:scale-105"
          >
            ⬅ Kembali ke Beranda
          </button>
        </div>

        {/* Biodata pembuat (sembunyi di bawah, kecil dan rapi) */}
        <footer className="text-center text-xs text-gray-500 italic pt-6">
          Dibuat oleh Rizki Febriyan (232505049) – Universitas Rizki
        </footer>
      </div>

      {/* Animasi masuk */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
