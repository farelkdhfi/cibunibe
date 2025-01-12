const express = require("express");
const Penduduk = require("../models/Penduduk");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Tambahkan penduduk
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
    const { laki, perempuan, penduduk, kepalaKeluarga } = req.body;

    try {
        const newPenduduk = new Penduduk({
          laki,
          perempuan,
          penduduk,
          kepalaKeluarga,
        });

        await newPenduduk.save();
        res.status(201).json(newPenduduk);
    } catch (err) {
        res.status(500).json({ message: "Error adding penduduk", error: err.message });
    }
});

// Get all penduduk
router.get("/", async (req, res) => {
    try {
        const penduduks = await Penduduk.find();
        res.json(penduduks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching penduduks", error: err.message });
    }
});

// Get Penduduk by ID
router.get("/:id", async (req, res) => {
    try {
        const penduduk = await Penduduk.findById(req.params.id);
        if (!penduduk) {
            return res.status(404).json({ message: "Penduduk not found" });
        }
        res.json(penduduk);
    } catch (err) {
        res.status(500).json({ message: "Error fetching penduduk", error: err.message });
    }
});

// Delete penduduk by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const penduduk = await Penduduk.findByIdAndDelete(req.params.id);
      if (!penduduk) return res.status(404).json({ message: "Penduduk not found" });
  
      res.json({ message: "Penduduk deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting penduduk", error: err.message });
    }
});

// Update penduduk by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { laki, perempuan, penduduk, kepalaKeluarga } = req.body;

    try {
      const updatedPenduduk = await Penduduk.findByIdAndUpdate(
        req.params.id,
        {
          laki,
          perempuan,
          penduduk,
          kepalaKeluarga,
        },
        { new: true } // Return produk yang telah diperbarui
      );

      if (!updatedPenduduk) {
        return res.status(404).json({ message: "Penduduk not found" });
      }

      res.json(updatedPenduduk);
    } catch (err) {
      res.status(500).json({ message: "Error updating penduduk", error: err.message });
    }
});

module.exports = router;
