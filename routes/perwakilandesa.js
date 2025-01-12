const express = require("express");
const router = express.Router();
const { uploadPerwakilanDesa } = require("../utils/cloudinary");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const PerwakilanDesa = require("../models/PerwakilanDesa");

// Tambahkan produk dengan upload gambar
router.post("/add", authenticateToken, isAdmin, uploadPerwakilanDesa.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    const imageUrl = req.file?.path; // URL gambar dari Cloudinary

    try {
        const newPerangkat = new PerwakilanDesa({
            nama,
            jabatan,    
            image: imageUrl,
        });

        await newPerangkat.save();
        res.status(201).json(newPerangkat);
    } catch (err) {
        res.status(500).json({ message: "Error adding perwakilan desa", error: err.message });
    }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 6 } = req.query; // Default: halaman 1, 6 berita per halaman
  try {
      const PerwakilanDesas = await PerwakilanDesa.find()
          .skip((page - 1) * limit) // Lewati berita berdasarkan halaman
          .limit(parseInt(limit)); // Batasi jumlah berita

      const totalPerwakilanDesas = await PerwakilanDesa.countDocuments(); // Total berita
      const totalPages = Math.ceil(totalPerwakilanDesas / limit); // Total halaman

      res.json({
          data: PerwakilanDesas,
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
    const perwakilanDesa = await PerwakilanDesa.findById(req.params.id);
    if (!perwakilanDesa) return res.status(404).json({ message: "PerwakilanDesa not found" });

    const now = new Date();
    const lastViewUpdate = perwakilanDesa.updatedAt || perwakilanDesa.createdAt;

    if (now - lastViewUpdate > MINIMUM_VIEW_INCREMENT_DELAY) {
      perwakilanDesa.views += 1;
      perwakilanDesa.updatedAt = now;
      await perwakilanDesa.save();
    }

    res.json(perwakilanDesa);
  } catch (err) {
    res.status(500).json({ message: "Error fetching PerwakilanDesa", error: err.message });
  }
});


// Delete PerwakilanDesa by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const perwakilanDesa = await PerwakilanDesa.findByIdAndDelete(req.params.id);
      if (!perwakilanDesa) return res.status(404).json({ message: "Perangkat desa not found" });
  
      res.json({ message: "Perangkat Desa deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting Perangkat Desa", error: err.message });
    }
  });

  // Update Perangkat Desa by ID
router.put("/:id", authenticateToken, isAdmin, uploadPerwakilanDesa.single("image"), async (req, res) => {
    const { nama, jabatan, } = req.body;
    let imageUrl;
  
    if (req.file) {
      imageUrl = req.file.path; // Jika ada file gambar baru, ambil URL dari Cloudinary
    }
  
    try {
      const updatedPerwakilanDesa = await PerwakilanDesa.findByIdAndUpdate(
        req.params.id,
        {
          nama,
          jabatan,
          ...(imageUrl && { image: imageUrl }), // Hanya perbarui gambar jika ada file baru
        },
        { new: true } // Return produk yang telah diperbarui
      );
  
      if (!updatedPerwakilanDesa) {
        return res.status(404).json({ message: "Perangkat desa not found" });
      }
  
      res.json(updatedPerwakilanDesa);
    } catch (err) {
      res.status(500).json({ message: "Error updating perangkat desa", error: err.message });
    }
  });  
  

module.exports = router;
