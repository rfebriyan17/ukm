import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import fs from 'fs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const username = formData.get('username');

    if (!file || !username) {
      return NextResponse.json({ message: 'File atau username tidak lengkap' }, { status: 400 });
    }

    // Konversi file ke Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Path ke folder public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Koneksi ke MongoDB
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    // Hapus avatar lama jika ada
    if (user.avatar && user.avatar !== '/default-avatar.png') {
      const oldFilePath = path.join(process.cwd(), 'public', user.avatar);
      if (fs.existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }
    }

    // Simpan file baru
    const fileName = `${username}-${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const avatarUrl = `/uploads/${fileName}`;

    // Update avatar user di database
    user.avatar = avatarUrl;
    await user.save();

    console.log('✅ Avatar disimpan di:', filePath);
    return NextResponse.json({
      message: 'Upload berhasil',
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat upload' }, { status: 500 });
  }
}
