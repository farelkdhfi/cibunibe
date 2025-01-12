const mongoose = require("mongoose");

const visimisiSchema = new mongoose.Schema({
  visi: { type: String, required: true },
  misi: { type: String, required: true },
},);

module.exports = mongoose.model("Visimisi", visimisiSchema);
