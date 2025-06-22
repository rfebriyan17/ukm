// app/api/pengumuman/[id]/route.js

import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const PengumumanSchema = new mongoose.Schema({
  judul: String,
  isi: String,
  tanggal: { type: Date, default: Date.now },
  status: { type: String, default: 'aktif' },
}, { timestamps: true });

const Pengumuman = mongoose.models.Pengumuman || mongoose.model('Pengumuman', PengumumanSchema);

// ✅ GET /api/pengumuman/[id]
export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // ambil [id] dari URL

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
    }

    const data = await Pengumuman.findById(id);
    if (!data) {
      return NextResponse.json({ message: 'Pengumuman tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data', error: error.message }, { status: 500 });
  }
}

// ✅ DELETE /api/pengumuman/[id]
export async function DELETE(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // ambil [id] dari URL

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
    }

    const deleted = await Pengumuman.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Pengumuman tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data', error: error.message }, { status: 500 });
  }
}
