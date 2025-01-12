const mongoose = require("mongoose");

const perangkatdesaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  image: { type: String, required: true }, // URL gambar
},);

module.exports = mongoose.model("PerangkatDesa", perangkatdesaSchema);
