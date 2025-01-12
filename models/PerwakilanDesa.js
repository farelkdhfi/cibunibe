const mongoose = require("mongoose");

const perwakilandesaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  image: { type: String, required: true }, // URL gambar
},);

module.exports = mongoose.model("PerwakilanDesa", perwakilandesaSchema);
