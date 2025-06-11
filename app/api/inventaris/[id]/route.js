import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const InventarisSchema = new mongoose.Schema({
  nama: String,
  jumlah: Number,
  kondisi: String,
}, { timestamps: true });

const Inventaris = mongoose.models.Inventaris || mongoose.model('Inventaris', InventarisSchema);

export async function PUT(request, context) {
  await connectDB();
  const { params } = await context;
  const { id } = params;

  const body = await request.json();

  try {
    const updated = await Inventaris.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Data tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Gagal memperbarui data', error: err.message }, { status: 500 });
  }
}
