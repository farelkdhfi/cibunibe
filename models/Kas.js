const mongoose = require("mongoose");

const kasSchema = new mongoose.Schema({
  tanah: { type: String, required: true },
  abodemen: { type: String, required: true },
  pam: { type: String, required: true },
  sewaGedung: { type: String, required: true },
  swadaya: { type: String, required: true },
  portal: { type: String, required: true },
  pengusaha: { type: String, required: true },
  bumdes: { type: String, required: true },
},);

module.exports = mongoose.model("Kas", kasSchema);
