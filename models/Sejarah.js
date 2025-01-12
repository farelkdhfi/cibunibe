const mongoose = require("mongoose");

const sejarahdesaSchema = new mongoose.Schema({
  sejarahDesa: { type: String, },
});

module.exports = mongoose.model("Sejarah", sejarahdesaSchema);
