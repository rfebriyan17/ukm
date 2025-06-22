// file: app/api/absensi/route.js
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const AbsensiSchema = new mongoose.Schema({
  userId: String,
  kegiatanId: String,
  hadir: Boolean,
}, { timestamps: true });

const Absensi = mongoose.models.Absensi || mongoose.model('Absensi', AbsensiSchema);

// GET all absensi (optional: filter by kegiatanId)
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const kegiatanId = searchParams.get('kegiatanId');

  const absensi = kegiatanId
    ? await Absensi.find({ kegiatanId })
    : await Absensi.find();

  return NextResponse.json(absensi);
}

// POST untuk tambah/update absensi
export async function POST(request) {
  await connectDB();
  const { userId, kegiatanId, hadir } = await request.json();

  const existing = await Absensi.findOne({ userId, kegiatanId });

  if (existing) {
    existing.hadir = hadir;
    await existing.save();
    return NextResponse.json({ message: 'Absensi diperbarui' });
  }

  const baru = new Absensi({ userId, kegiatanId, hadir });
  await baru.save();
  return NextResponse.json({ message: 'Absensi ditambahkan' });
}

// DELETE untuk hapus absensi berdasarkan userId & kegiatanId
export async function DELETE(request) {
  await connectDB();
  const { userId, kegiatanId } = await request.json();

  await Absensi.deleteOne({ userId, kegiatanId });
  return NextResponse.json({ message: 'Absensi dihapus' });
}
