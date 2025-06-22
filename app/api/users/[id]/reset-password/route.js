import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  const defaultPassword = '12345678';
  const hashed = await bcrypt.hash(defaultPassword, 10);

  const user = await User.findByIdAndUpdate(id, {
    password: hashed,
  });

  if (!user) {
    return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Password berhasil direset ke default (12345678)' });
}
