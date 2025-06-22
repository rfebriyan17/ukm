import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// Schema
const PengumumanSchema = new mongoose.Schema({
  judul: String,
  isi: String,
  tanggal: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'aktif',
  },
}, { timestamps: true });

const Pengumuman = mongoose.models.Pengumuman || mongoose.model('Pengumuman', PengumumanSchema);

// GET semua pengumuman aktif
export async function GET() {
  await connectDB();
  const data = await Pengumuman.find({ status: 'aktif' }).sort({ createdAt: -1 });
  return NextResponse.json(data);
}

// POST pengumuman baru
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { judul, isi, tanggal } = body;

    // Konversi tanggal dari string ke Date
    const parsedDate = tanggal ? new Date(tanggal) : new Date();
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: 'Tanggal tidak valid' }, { status: 400 });
    }

    const created = await Pengumuman.create({
      judul,
      isi,
      tanggal: parsedDate,
      status: 'aktif',
    });

    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json({ message: 'Gagal membuat pengumuman', error: err.message }, { status: 500 });
  }
}
