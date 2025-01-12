const express = require("express");
const router = express.Router();
const { uploadLpm } = require("../utils/cloudinary");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const Lpm = require("../models/Lpm");

// Tambahkan produk dengan upload gambar
router.post("/add", authenticateToken, isAdmin, uploadLpm.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    const imageUrl = req.file?.path; // URL gambar dari Cloudinary

    try {
        const newPerangkat = new Lpm({
            nama,
            jabatan,    
            image: imageUrl,
        });

        await newPerangkat.save();
        res.status(201).json(newPerangkat);
    } catch (err) {
        res.status(500).json({ message: "Error adding perangkat desa", error: err.message });
    }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 6 } = req.query; // Default: halaman 1, 6 berita per halaman
  try {
      const Lpms = await Lpm.find()
          .skip((page - 1) * limit) // Lewati berita berdasarkan halaman
          .limit(parseInt(limit)); // Batasi jumlah berita

      const totalLpms = await Lpm.countDocuments(); // Total berita
      const totalPages = Math.ceil(totalLpms / limit); // Total halaman

      res.json({
          data: Lpms,
          currentPage: parseInt(page),
          totalPages,
      });
  } catch (err) {
      res.status(500).json({ message: "Error fetching perangkat desa", error: err.message });
  }
});



// Get berita details by ID dan tingkatkan jumlah views
const MINIMUM_VIEW_INCREMENT_DELAY = 5000; // 5 detik

router.get("/:id", async (req, res) => {
  try {
    const lpm = await Lpm.findById(req.params.id);
    if (!lpm) return res.status(404).json({ message: "Lpm not found" });

    const now = new Date();
    const lastViewUpdate = lpm.updatedAt || lpm.createdAt;

    if (now - lastViewUpdate > MINIMUM_VIEW_INCREMENT_DELAY) {
      lpm.views += 1;
      lpm.updatedAt = now;
      await lpm.save();
    }

    res.json(lpm);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Lpm", error: err.message });
  }
});


// Delete Lpm by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const lpm = await Lpm.findByIdAndDelete(req.params.id);
      if (!lpm) return res.status(404).json({ message: "Perangkat desa not found" });
  
      res.json({ message: "Perangkat Desa deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting Perangkat Desa", error: err.message });
    }
  });

  // Update Perangkat Desa by ID
router.put("/:id", authenticateToken, isAdmin, uploadLpm.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    let imageUrl;
  
    if (req.file) {
      imageUrl = req.file.path; // Jika ada file gambar baru, ambil URL dari Cloudinary
    }
  
    try {
      const updatedLpm = await Lpm.findByIdAndUpdate(
        req.params.id,
        {
          nama,
          jabatan,
          ...(imageUrl && { image: imageUrl }), // Hanya perbarui gambar jika ada file baru
        },
        { new: true } // Return produk yang telah diperbarui
      );
  
      if (!updatedLpm) {
        return res.status(404).json({ message: "Perangkat desa not found" });
      }
  
      res.json(updatedLpm);
    } catch (err) {
      res.status(500).json({ message: "Error updating perangkat desa", error: err.message });
    }
  });  
  

module.exports = router;
