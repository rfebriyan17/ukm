import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Skema
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
  nama: String,
  role: String,
  status: String,
}, { timestamps: true });

const PengumumanSchema = new mongoose.Schema({
  judul: String,
  isi: String,
  status: String,
  tanggal: Date, // ✅ tambahkan tanggal ke skema agar bisa dibaca
}, { timestamps: true });

const AbsensiSchema = new mongoose.Schema({
  userId: String,
  kegiatanId: String,
  hadir: Boolean,
}, { timestamps: true });

// Model
const Kegiatan = mongoose.models.Kegiatan || mongoose.model('Kegiatan', KegiatanSchema);
const Inventaris = mongoose.models.Inventaris || mongoose.model('Inventaris', InventarisSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Pengumuman = mongoose.models.Pengumuman || mongoose.model('Pengumuman', PengumumanSchema);
const Absensi = mongoose.models.Absensi || mongoose.model('Absensi', AbsensiSchema);

// Handler GET
export async function GET() {
  try {
    await connectDB();

    const jumlahUKM = await Kegiatan.distinct('nama').then(res => res.length);
    const jumlahMahasiswa = await User.countDocuments({ role: 'mhs' });

    const kegiatanHariIni = await Kegiatan.countDocuments({
      tanggal: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const laporanBulanan = await Kegiatan.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$tanggal" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daftarUKM = await Kegiatan.aggregate([
      { $group: { _id: "$nama" } },
      { $project: { nama: "$_id", _id: 0 } },
    ]);

    const daftarUsers = await User.find({}, { password: 0 });
    const daftarKegiatan = await Kegiatan.find();
    const daftarInventaris = await Inventaris.find();

    const pengumumanAktif = await Pengumuman.countDocuments({ status: 'aktif' });
    const daftarPengumuman = await Pengumuman.find({ status: 'aktif' }).sort({ createdAt: -1 });

    const jumlahAbsensi = await Absensi.countDocuments();

    return NextResponse.json({
      jumlahUKM,
      jumlahMahasiswa,
      kegiatanHariIni,
      laporanBulanan,
      daftarUKM,
      daftarUsers,
      daftarKegiatan,
      daftarInventaris,
      pengumumanAktif,
      daftarPengumuman,
      jumlahAbsensi,
    });
  } catch (err) {
    console.error('❌ ERROR API /api/dashboard:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
