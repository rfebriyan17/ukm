// models/Absensi.js
import mongoose from 'mongoose';

const AbsensiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kegiatanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kegiatan' },
  hadir: Boolean,
  tanggal: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Absensi || mongoose.model('Absensi', AbsensiSchema);
