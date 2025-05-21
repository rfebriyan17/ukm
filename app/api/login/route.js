import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('ukm');

    // Cari admin dengan username yang dikirim
    const admin = await db.collection('admin').findOne({ username });

    if (!admin) {
      return new Response(JSON.stringify({ message: 'Username tidak ditemukan' }), { status: 401 });
    }

    if (admin.password !== password) {
      return new Response(JSON.stringify({ message: 'Password salah' }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Login berhasil' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server' }), { status: 500 });
  }
}
