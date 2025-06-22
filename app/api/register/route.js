import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, password, nama, role } = await req.json();
  await connectDB();

  const existing = await User.findOne({ username });
  if (existing) {
    return NextResponse.json({ message: 'Username sudah terdaftar' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    nama,
    role,
    status: 'Aktif',
  });

  return NextResponse.json({ message: 'Registrasi berhasil', id: newUser._id });
}
