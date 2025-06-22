// app/api/kegiatan-mahasiswa/route.js
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import KegiatanMahasiswa from '@/models/KegiatanMahasiswa';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await KegiatanMahasiswa.find({ userId: session.user.id }).populate('kegiatanId');

  const hasil = data.map((item) => ({
    _id: item._id,
    kegiatan: item.kegiatanId ? {
      nama: item.kegiatanId.nama,
      tanggal: item.kegiatanId.tanggal,
    } : null,
    createdAt: item.createdAt,
  }));

  return Response.json(hasil);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { kegiatanId } = await req.json();

  if (!kegiatanId) {
    return Response.json({ message: 'ID kegiatan wajib diisi.' }, { status: 400 });
  }

  const sudahAda = await KegiatanMahasiswa.findOne({
    userId: session.user.id,
    kegiatanId,
  });

  if (sudahAda) {
    return Response.json({ message: 'Kegiatan sudah pernah ditambahkan.' }, { status: 400 });
  }

  const baru = await KegiatanMahasiswa.create({
    userId: session.user.id,
    kegiatanId,
  });

  return Response.json(baru);
}
