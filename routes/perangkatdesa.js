const express = require("express");
const router = express.Router();
const { uploadPerangkatDesa } = require("../utils/cloudinary");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const PerangkatDesa = require("../models/PerangkatDesa");

// Tambahkan produk dengan upload gambar
router.post("/add", authenticateToken, isAdmin, uploadPerangkatDesa.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    const imageUrl = req.file?.path; // URL gambar dari Cloudinary

    try {
        const newPerangkat = new PerangkatDesa({
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
      const perangkatDesas = await PerangkatDesa.find()
          .skip((page - 1) * limit) // Lewati berita berdasarkan halaman
          .limit(parseInt(limit)); // Batasi jumlah berita

      const totalPerangkatDesas = await PerangkatDesa.countDocuments(); // Total berita
      const totalPages = Math.ceil(totalPerangkatDesas / limit); // Total halaman

      res.json({
          data: perangkatDesas,
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
    const perangkatDesa = await PerangkatDesa.findById(req.params.id);
    if (!perangkatDesa) return res.status(404).json({ message: "perangkatDesa not found" });

    const now = new Date();
    const lastViewUpdate = perangkatDesa.updatedAt || perangkatDesa.createdAt;

    if (now - lastViewUpdate > MINIMUM_VIEW_INCREMENT_DELAY) {
      perangkatDesa.views += 1;
      perangkatDesa.updatedAt = now;
      await perangkatDesa.save();
    }

    res.json(perangkatDesa);
  } catch (err) {
    res.status(500).json({ message: "Error fetching perangkatDesa", error: err.message });
  }
});


// Delete perangkatDesa by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const perangkatDesa = await PerangkatDesa.findByIdAndDelete(req.params.id);
      if (!perangkatDesa) return res.status(404).json({ message: "Perangkat desa not found" });
  
      res.json({ message: "Perangkat Desa deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting Perangkat Desa", error: err.message });
    }
  });

  // Update Perangkat Desa by ID
router.put("/:id", authenticateToken, isAdmin, uploadPerangkatDesa.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    let imageUrl;
  
    if (req.file) {
      imageUrl = req.file.path; // Jika ada file gambar baru, ambil URL dari Cloudinary
    }
  
    try {
      const updatedPerangkatDesa = await PerangkatDesa.findByIdAndUpdate(
        req.params.id,
        {
          nama,
          jabatan,
          ...(imageUrl && { image: imageUrl }), // Hanya perbarui gambar jika ada file baru
        },
        { new: true } // Return produk yang telah diperbarui
      );
  
      if (!updatedPerangkatDesa) {
        return res.status(404).json({ message: "Perangkat desa not found" });
      }
  
      res.json(updatedPerangkatDesa);
    } catch (err) {
      res.status(500).json({ message: "Error updating perangkat desa", error: err.message });
    }
  });  
  

module.exports = router;
