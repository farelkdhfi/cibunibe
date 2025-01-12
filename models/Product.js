const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  namaProduct: { type: String, required: true },
  deskripsiProduct: { type: String, required: true },
  hargaProduct: { type: String, required: true },
  kontak: { type: Number, required: true },
  views: { type: Number, default: 0 }, // Jumlah dilihat
  image: { type: String, required: true }, // URL gambar
}, { timestamps: true } );

module.exports = mongoose.model("Product", productSchema);
