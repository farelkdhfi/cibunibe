const mongoose = require("mongoose");

const peribadatanSchema = new mongoose.Schema({
  masjid: { type: String, required: true },
  mushola: { type: String, required: true },
});

module.exports = mongoose.model("Peribadatan", peribadatanSchema);
