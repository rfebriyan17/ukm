// models/Kegiatan.js
import mongoose from 'mongoose';

const KegiatanSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  tanggal: { type: String, required: true },
});

const Kegiatan = mongoose.models.Kegiatan || mongoose.model('Kegiatan', KegiatanSchema);
export default Kegiatan;
