const mongoose = require("mongoose");

const pendudukSchema = new mongoose.Schema({
  laki: { type: String, },
  perempuan: { type: String, },
  kepalaKeluarga: { type: String, },
  penduduk: { type: String, }, // URL gambar
});

module.exports = mongoose.model("Penduduk", pendudukSchema);
