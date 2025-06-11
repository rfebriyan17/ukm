import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Fungsi untuk mengambil ID dari URL
function getIdFromRequestUrl(request) {
  const url = new URL(request.url);
  return url.pathname.split('/').pop();
}

// PUT update user
export async function PUT(request) {
  try {
    await connectDB();

    const id = getIdFromRequestUrl(request);
    const { username, role } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
    }

    if (!username || !role) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('❌ PUT user error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE hapus user
export async function DELETE(request) {
  try {
    await connectDB();

    const id = getIdFromRequestUrl(request);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('❌ DELETE user error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
