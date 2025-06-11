import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Skema Mongoose
const KegiatanSchema = new mongoose.Schema({
  nama: String,
  tanggal: Date,
}, { timestamps: true });

const InventarisSchema = new mongoose.Schema({
  nama: String,
  jumlah: Number,
  kondisi: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
}, { timestamps: true });

// Inisialisasi Model (tanpa duplikat)
const Kegiatan = mongoose.models.Kegiatan || mongoose.model('Kegiatan', KegiatanSchema);
const Inventaris = mongoose.models.Inventaris || mongoose.model('Inventaris', InventarisSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function GET() {
  await connectDB();

  // ✅ Hitung jumlah UKM berdasarkan nama kegiatan yang unik
  const jumlahUKM = await Kegiatan.distinct('nama').then(res => res.length);

  // ✅ Hitung jumlah mahasiswa berdasarkan role
  const jumlahMahasiswa = await User.countDocuments({ role: 'mhs' });

  // ✅ Hitung jumlah kegiatan hari ini
  const kegiatanHariIni = await Kegiatan.countDocuments({
    tanggal: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    }
  });

  // ✅ Laporan bulanan: jumlah kegiatan per bulan
  const laporanBulanan = await Kegiatan.aggregate([
    {
      $group: {
        _id: { $month: { $toDate: "$tanggal" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // ✅ Daftar nama UKM unik (dari nama kegiatan)
  const daftarUKM = await Kegiatan.aggregate([
    { $group: { _id: "$nama" } },
    { $project: { nama: "$_id", _id: 0 } }
  ]);

  // ✅ Ambil data lengkap lainnya
  const daftarUsers = await User.find();
  const daftarKegiatan = await Kegiatan.find();
  const daftarInventaris = await Inventaris.find();

  return NextResponse.json({
    jumlahUKM,
    jumlahMahasiswa,
    kegiatanHariIni,
    laporanBulanan,
    daftarUKM,
    daftarUsers,
    daftarKegiatan,
    daftarInventaris
  });
}
