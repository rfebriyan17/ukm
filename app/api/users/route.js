// app/api/users/route.js
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// GET semua user
export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

// POST tambah user
export async function POST(req) {
  await connectDB();
  const { username, role } = await req.json();

  if (!username || !role) {
    return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
  }

  const newUser = await User.create({ username, role });
  return NextResponse.json({
    message: 'User berhasil ditambahkan',
    id: newUser._id,
  });
}
