// models/KegiatanMahasiswa.js
import mongoose from 'mongoose';

const KegiatanMahasiswaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  kegiatanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kegiatan', required: true },
}, { timestamps: true });

export default mongoose.models.KegiatanMahasiswa || mongoose.model('KegiatanMahasiswa', KegiatanMahasiswaSchema);
