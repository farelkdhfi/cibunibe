const mongoose = require("mongoose");

const dusunSchema = new mongoose.Schema({
  dusun: { type: String, required: true },
  laki: { type: String, required: true },
  perempuan: { type: String, required: true },
  kk: { type: String, required: true },  
});

module.exports = mongoose.model("Dusun", dusunSchema);
