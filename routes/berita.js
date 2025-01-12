const express = require("express");
const router = express.Router();
const { uploadBerita } = require("../utils/cloudinary");
const Berita = require("../models/Berita");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

// Tambahkan produk dengan upload gambar
router.post("/add", authenticateToken, isAdmin, uploadBerita.single("image"), async (req, res) => {
    const { judulBerita, deskripsiBerita, } = req.body;
    const imageUrl = req.file?.path; // URL gambar dari Cloudinary

    try {
        const newBerita = new Berita({
            judulBerita,
            deskripsiBerita,    
            image: imageUrl,
        });

        await newBerita.save();
        res.status(201).json(newBerita);
    } catch (err) {
        res.status(500).json({ message: "Error adding berita", error: err.message });
    }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 6 } = req.query; // Default: halaman 1, 6 berita per halaman
  try {
      const beritas = await Berita.find()
          .skip((page - 1) * limit) // Lewati berita berdasarkan halaman
          .limit(parseInt(limit)); // Batasi jumlah berita

      const totalBeritas = await Berita.countDocuments(); // Total berita
      const totalPages = Math.ceil(totalBeritas / limit); // Total halaman

      res.json({
          data: beritas,
          currentPage: parseInt(page),
          totalPages,
      });
  } catch (err) {
      res.status(500).json({ message: "Error fetching beritas", error: err.message });
  }
});



// Get berita details by ID dan tingkatkan jumlah views
const MINIMUM_VIEW_INCREMENT_DELAY = 5000; // 5 detik

router.get("/:id", async (req, res) => {
  try {
    const berita = await Berita.findById(req.params.id);
    if (!berita) return res.status(404).json({ message: "Berita not found" });

    const now = new Date();
    const lastViewUpdate = berita.updatedAt || berita.createdAt;

    if (now - lastViewUpdate > MINIMUM_VIEW_INCREMENT_DELAY) {
      berita.views += 1;
      berita.updatedAt = now;
      await berita.save();
    }

    res.json(berita);
  } catch (err) {
    res.status(500).json({ message: "Error fetching berita", error: err.message });
  }
});


// Delete berita by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const berita = await Berita.findByIdAndDelete(req.params.id);
      if (!berita) return res.status(404).json({ message: "Berita not found" });
  
      res.json({ message: "Berita deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting berita", error: err.message });
    }
  });

  // Update berita by ID
router.put("/:id", authenticateToken, isAdmin, uploadBerita.single("image"), async (req, res) => {
    const { judulBerita, deskripsiBerita, } = req.body;
    let imageUrl;
  
    if (req.file) {
      imageUrl = req.file.path; // Jika ada file gambar baru, ambil URL dari Cloudinary
    }
  
    try {
      const updatedBerita = await Berita.findByIdAndUpdate(
        req.params.id,
        {
          judulBerita,
          deskripsiBerita,
          ...(imageUrl && { image: imageUrl }), // Hanya perbarui gambar jika ada file baru
        },
        { new: true } // Return produk yang telah diperbarui
      );
  
      if (!updatedBerita) {
        return res.status(404).json({ message: "Berita not found" });
      }
  
      res.json(updatedBerita);
    } catch (err) {
      res.status(500).json({ message: "Error updating berita", error: err.message });
    }
  });  
  

module.exports = router;
