// app/api/inventaris/route.js
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const InventarisSchema = new mongoose.Schema({
  nama: String,
  jumlah: Number,
  kondisi: String,
}, { timestamps: true });

const Inventaris = mongoose.models.Inventaris || mongoose.model('Inventaris', InventarisSchema);

export async function GET() {
  await connectDB();
  const data = await Inventaris.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const item = new Inventaris(body);
  await item.save();
  return NextResponse.json(item);
}

export async function DELETE(request) {
  await connectDB();
  const { id } = await request.json();
  const result = await Inventaris.findByIdAndDelete(id);
  if (!result) {
    return NextResponse.json({ message: 'Inventaris tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Berhasil dihapus' });
}
