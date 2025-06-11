import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

export async function POST(request) {
  try {
    const { username, password, nama, role } = await request.json();

    if (!username || !password || !nama || !role) {
      return new Response(JSON.stringify({ message: 'Semua field wajib diisi.' }), { status: 400 });
    }

    await connectDB();
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('ukm');
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Username sudah digunakan.' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = role.toLowerCase() === 'pengurus' ? 'pending' : 'approved';

    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      nama,
      role: role.toLowerCase(),
      status,
    });

    return new Response(JSON.stringify({ message: 'Registrasi berhasil!' }), { status: 201 });
  } catch (error) {
    console.error('❌ Register error:', error);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan saat registrasi.' }), {
      status: 500,
    });
  }
}
