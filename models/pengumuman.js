// models/Pengumuman.js
import mongoose from 'mongoose';

const PengumumanSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  isi: { type: String, required: true },
  tanggal: { type: Date, default: Date.now },
  status: { type: String, default: 'aktif' },
}, { timestamps: true });

const Pengumuman = mongoose.models.Pengumuman || mongoose.model('Pengumuman', PengumumanSchema);
export default Pengumuman;
