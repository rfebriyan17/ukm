import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nama: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'pengurus', 'mhs'], required: true },
  status: { type: String, default: 'Aktif' },
  avatar: { type: String, default: '' }, // ✅ field avatar sudah benar
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
