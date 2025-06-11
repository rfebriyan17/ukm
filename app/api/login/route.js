import { connectDB } from '@/lib/mongodb';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validasi input
    if (!username || !password) {
      return new Response(JSON.stringify({ message: 'Username dan password wajib diisi.' }), {
        status: 400,
      });
    }

    // Koneksi ke database
    await connectDB();
    const client = new MongoClient(process.env.MONGODB_URI); // atau gunakan `mongoose.connection` jika prefer
    await client.connect();
    const db = client.db('ukm');
    const usersCollection = db.collection('users');

    // Cari user (case-insensitive)
    const user = await usersCollection.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Username tidak ditemukan' }), {
        status: 401,
      });
    }

    console.log('🔍 Username input:', username);
    console.log('🔐 Password input:', password);
    console.log('📦 User dari database:', user);

    if (!user.password) {
      return new Response(JSON.stringify({ message: 'Password tidak ditemukan di database.' }), {
        status: 500,
      });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Password salah' }), {
        status: 401,
      });
    }

    // Jika berhasil login
    return new Response(
      JSON.stringify({
        message: 'Login berhasil',
        role: user.role,
        nama: user.nama,
        id: user._id.toString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Login error:', error);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server' }), {
      status: 500,
    });
  }
}
