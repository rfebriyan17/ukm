import mongoose from 'mongoose';

const UKMSchema = new mongoose.Schema({
  nama: String,
  ketua: String,
  anggota: Number,
}, { timestamps: true });

export default mongoose.models.UKM || mongoose.model('UKM', UKMSchema);
