const mongoose = require("mongoose");

const apbdesaSchema = new mongoose.Schema({
  pengeluaranDesa: { type: String, },
  pendapatanDesa: { type: String, },
});

module.exports = mongoose.model("Apbdesa", apbdesaSchema);
