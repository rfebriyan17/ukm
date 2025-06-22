// updateAdminPassword.js
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = 'mongodb+srv://rfebriyan99:123@ukm.169zyon.mongodb.net/?retryWrites=true&w=majority&appName=ukm';
const client = new MongoClient(uri);

async function updatePassword() {
  try {
    await client.connect();
    const db = client.db('ukm');
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const result = await users.updateOne(
      { username: { $regex: '^admin$', $options: 'i' } },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      console.log('✅ Password admin berhasil diganti ke "admin123"');
    } else {
      console.log('⚠️ Admin tidak ditemukan atau password tidak berubah.');
    }
  } catch (error) {
    console.error('❌ Gagal mengganti password admin:', error);
  } finally {
    await client.close();
  }
}

updatePassword();
