import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET: Ambil semua user (tanpa password)
export async function GET() {
  await connectDB();
  const users = await User.find({}, '-password');
  return NextResponse.json(users);
}

// POST: Tambah user baru
export async function POST(req) {
  await connectDB();
  const { username, nama, password, role, status } = await req.json();

  if (!username || !password || !role) {
    return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
  }

  const existing = await User.findOne({ username });
  if (existing) {
    return NextResponse.json({ message: 'Username sudah digunakan' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    nama,
    password: hashedPassword,
    role,
    status: status || 'Aktif',
  });

  return NextResponse.json({ message: 'User berhasil ditambahkan', id: newUser._id });
}
