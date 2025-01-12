const mongoose = require("mongoose");

const pekerjaanSchema = new mongoose.Schema({
  petani: { type: String, required: true },
  pedagang: { type: String, required: true },
  pengrajin: { type: String, required: true },
  pns: { type: String, required: true },
  tni: { type: String, required: true },
  pensiunan: { type: String, required: true },
  swasta: { type: String, required: true },
  buruh: { type: String, required: true },
},);

module.exports = mongoose.model("Pekerjaan", pekerjaanSchema);
