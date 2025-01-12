const mongoose = require("mongoose");

const beritaSchema = new mongoose.Schema({
  judulBerita: { type: String, required: true },
  deskripsiBerita: { type: String, required: true },
  views: { type: Number, default: 0 }, // Jumlah dilihat
  image: { type: String, required: true }, // URL gambar
}, { timestamps: true } );

module.exports = mongoose.model("Berita", beritaSchema);
