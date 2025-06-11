import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = 'mongodb+srv://rfebriyan99:123@ukm.169zyon.mongodb.net/?retryWrites=true&w=majority&appName=ukm';
const client = new MongoClient(uri);

async function ensureUsersExist() {
  try {
    await client.connect();
    const db = client.db('ukm');
    const usersCollection = db.collection('users');

    const defaultUsers = [
      { username: 'admin', password: '123', role: 'admin', nama: 'Admin' },
      { username: 'pengurus', password: '123', role: 'pengurus', nama: 'Pengurus' },
      { username: 'mahasiswa', password: '123', role: 'mhs', nama: 'Mahasiswa' },
    ];

    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const result = await usersCollection.updateOne(
        { username: user.username },
        {
          $set: {
            password: hashedPassword,
            role: user.role,
            nama: user.nama,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`✅ User "${user.username}" berhasil dibuat.`);
      } else {
        console.log(`🔄 User "${user.username}" sudah ada, diperbarui.`);
      }
    }
  } catch (err) {
    console.error('❌ Gagal memastikan user ada:', err);
  } finally {
    await client.close();
  }
}

ensureUsersExist();
