// app/api/kegiatan/[id]/route.js
import { connectDB } from '@/lib/mongodb';
import Kegiatan from '@/models/Kegiatan';

export async function PUT(request) {
  await connectDB();
  const data = await request.json();
  const id = request.url.split('/').pop();  // Ambil ID dari URL
  const updated = await Kegiatan.findByIdAndUpdate(id, data, { new: true });
  return Response.json(updated);
}

export async function DELETE(request) {
  await connectDB();
  const id = request.url.split('/').pop();  // Ambil ID dari URL
  await Kegiatan.findByIdAndDelete(id);
  return Response.json({ message: 'Kegiatan berhasil dihapus' });
}
