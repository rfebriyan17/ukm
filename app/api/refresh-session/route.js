import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  const token = await getToken({ req });

  if (!token || !token.username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ username: token.username });

  if (!user) {
    return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ avatar: user.avatar });
}
