import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI belum diset di .env.local');
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
  nama: { type: String },
  role: { type: String, required: true },
  status: { type: String },
  avatar: { type: String }, // ✅ konsisten dengan session & upload
}, { timestamps: true });

// Gunakan cache koneksi global
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'ukm',
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Export model agar bisa digunakan di API
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
