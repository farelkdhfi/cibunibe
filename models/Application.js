const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
   // Data Umum
   nama: { type: String, trim: true },
   nik: { 
     type: String, 
     minlength: 16, 
     maxlength: 16, 
     match: /^\d{16}$/ 
   },
   kk: { 
     type: String, 
     minlength: 16, 
     maxlength: 16, 
     match: /^\d{16}$/ 
   },
   jenisKelamin: { 
     type: String, 
   },
   tempatTanggalLahir: { type: String, },
   pendidikan: { 
     type: String, 
   },
   statusPerkawinan: { 
     type: String, 
   },
   kewarganegaraan: { 
     type: String, 
   },
   pekerjaan: { type: String },
   alamatSebelumnya: { type: String },
   alamatSekarang: { type: String, },
   namaLembaga: { type: String },
   ketua: { type: String },
   tahunBerdiri: { 
     type: String, 
     match: /^\d{4}$/ 
   },
   alamatLengkap: { type: String },
   noIdDtks: { type: String },
   kontak: { 
     type: String, 
     match: /^\d{10,15}$/ 
   },
   alamatPerusahaan: { type: String },
   bidangUsaha: { type: String },
   jasaDagangUtama: { type: String },
   keadaanUsahaSaatIni: { type: String },
   diagnosaPenyakit: { type: String },
   kepalaKeluarga: { type: String },
   kelurahan: { type: String },
   kecamatan: { type: String },
   alamatTujuanPindah: { type: String },
   jenisKepindahan: { type: String },
   klasifikasiPindah: { type: String },
   statusKkygTdkPindah: { type: String },
   statusKkygPindah: { type: String },
   keluargaygPindah: { type: String },
   agama: { 
     type: String, 
   },
   bentukPerusahaan: { type: String },
   npwp: { 
     type: String, 
     match: /^\d{15}$/ 
   },
   alasan: { type: String },
   fotoKk: { type: String },
   fotoKtp: { type: String },
   fotoLokasiUsaha: { type: String },
   fotoLokasiTanah: { type: String },


  //SURAT KETERANGAN DOMISILI PERORANGAN (SKDP)
    // name
    // nik
    // jenisKelamin
    // tempatTanggalLahir
    // pendidikan
    // agama
    // statusPerkawinan
    // kewarganegaraan
    // pekerjaan
    // alamatSebelumnya
    // alamatSekarang

  //SURAT KETERANGAN DOMISILI LEMBAGA (SKDL)
    // namaLembaga
    // ketua
    // tahunBerdiri
    // alamatLengkap

  //SURAT KETERANGAN TIDAK MAMPU (SKTM)
    // nama
    // kk
    // nik
    // jenisKelamin
    // tempatTanggalLahir
    // noIdDtks
    // pekerjaan
    // alamatLengkap

  //SURAT KETERANGAN USAHA (SKU)
    // nama
    // nik
    // tempatTanggalLahir
    // bentukPerusahaan
    // npwp
    // alamatPerusahaan
    // alamatLengkap
    // bidangUsaha
    // jasaDagangUtama
    // keadaanUsahaSaatIni

  //SURAT PERMOHONAN BANTUAN SOSIAL (SPBS)
    // nama
    // kk
    // nik
    // tempatTanggalLahir
    // jenisKelamin
    // pekerjaan
    // diagnosaPenyakit
    // alamatLengkap

  //SURAT KETERANGAN PINDAH DOMISILI (SKPD)
    // kk
    // kepalaKeluarga
    // alamatSebelumnya
    // kelurahan
    // kecamatan
    // kontak
    // nik
    // nama
    // alasan
    // alamatTujuanPindah
    // jenisKepindahan
    // klasifikasiPindah
    // statusKkygTdkPindah
    // statusKkygPindah
    // keluargaygPindah


  //Admin saja
    status: { type: String, enum: ["Menunggu", "Disetujui", "Ditolak"], default: "Menunggu" },
    adminNotes: { type: String, default: "" },    
    kop1: { type: Number, default: "" },    
    kop2: { type: Number, default: "" },    
    kop3: { type: Number, default: "" },    
    kop4: { type: Number, default: "" },    
    pdfPath: { type: String }, // Path to generated PDF
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Relasi ke User
    type: { type: String, enum: ["SKDP", "SKDL", "SKTM", "SKPD", "SPBS", "SKU"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);