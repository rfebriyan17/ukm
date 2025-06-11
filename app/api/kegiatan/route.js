// app/api/kegiatan/route.js
import { connectDB } from '@/lib/mongodb';
import Kegiatan from '@/models/Kegiatan';

export async function GET() {
  await connectDB();
  const kegiatan = await Kegiatan.find();
  return Response.json(kegiatan);
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();
  const newKegiatan = await Kegiatan.create(data);
  return Response.json(newKegiatan);
}
