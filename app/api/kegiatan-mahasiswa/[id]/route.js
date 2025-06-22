import { connectDB } from '@/lib/mongodb';
import KegiatanMahasiswa from '@/models/KegiatanMahasiswa';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(req, context) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params; // ✅ ini perbaikannya

  try {
    const deleted = await KegiatanMahasiswa.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deleted) {
      return Response.json({ message: 'Data tidak ditemukan.' }, { status: 404 });
    }

    return Response.json({ message: 'Berhasil dihapus.' });
  } catch (error) {
    console.error('Gagal menghapus:', error);
    return Response.json({ message: 'Terjadi kesalahan saat menghapus.' }, { status: 500 });
  }
}
