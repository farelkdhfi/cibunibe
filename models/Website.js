const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  namaKepalaDesa: { type: String, },
  sambutan: { type: String, },
  fotoKepalaDesa: { type: String, },
  //Sekretaris Desa
  namaSekretarisDesa: { type: String, },
  fotoSekretarisDesa: { type: String, },
  //Kasi Pemerintahan
  namaKasiPemerintahan: { type: String, },
  fotoKasiPemerintahan: { type: String, },
  //Kasi Kesra
  namaKasiKesra: { type: String, },
  fotoKasiKesra: { type: String, },

});

module.exports = mongoose.model("Website", websiteSchema);
