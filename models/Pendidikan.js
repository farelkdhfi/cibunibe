const mongoose = require("mongoose");

const pendidikanSchema = new mongoose.Schema({
  belumSekolah: { type: String, required: true },
  tamatSd: { type: String, required: true },
  tidakTamatSd: { type: String, required: true },
  tamatSLTA: { type: String, required: true },
  tamatPerguruanTinggi: { type: String, required: true },
  madrasah: { type: String, required: true },
  majelis: { type: String, required: true },
});

module.exports = mongoose.model("Pendidikan", pendidikanSchema);
