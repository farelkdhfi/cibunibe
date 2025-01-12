const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage untuk produk
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Folder di Cloudinary untuk menyimpan gambar produk
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const upload = multer({ storage });

// Storage untuk aplikasi
const storageApp = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "application", // Folder di Cloudinary untuk menyimpan gambar aplikasi
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadApp = multer({ storage: storageApp });

// Storage untuk website
const storageWeb = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "web", // Folder di Cloudinary untuk menyimpan gambar konten web
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadWeb = multer({ storage: storageWeb });

// Storage untuk website
const storageBerita = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "berita", // Folder di Cloudinary untuk menyimpan gambar konten web
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadBerita = multer({ storage: storageBerita });

// Storage untuk website
const storagePerangkatDesa = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "perangkatDesa", // Folder di Cloudinary untuk menyimpan gambar konten web
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadPerangkatDesa = multer({ storage: storagePerangkatDesa });

// Storage untuk website
const storagePerwakilanDesa = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "perwakilanDesa", // Folder di Cloudinary untuk menyimpan gambar konten web
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadPerwakilanDesa = multer({ storage: storagePerwakilanDesa });

// Storage untuk website
const storageLpm = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lpm", // Folder di Cloudinary untuk menyimpan gambar konten web
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});
const uploadLpm = multer({ storage: storageLpm });

module.exports = { cloudinary, upload, uploadApp, uploadWeb, uploadBerita, uploadPerangkatDesa, uploadPerwakilanDesa, uploadLpm };
