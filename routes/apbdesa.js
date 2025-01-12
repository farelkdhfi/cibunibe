const express = require("express");
const Apbdesa = require("../models/Apbdesa");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Tambahkan penduduk
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
    const { pengeluaranDesa, pendapatanDesa, } = req.body;

    try {
        const newApbdesa = new Apbdesa({
          pengeluaranDesa,
          pendapatanDesa,
        });

        await newApbdesa.save();
        res.status(201).json(newApbdesa);
    } catch (err) {
        res.status(500).json({ message: "Error adding Apb", error: err.message });
    }
});

// Get all apb
router.get("/", async (req, res) => {
    try {
        const apbdesas = await Apbdesa.find();
        res.json(apbdesas);
    } catch (err) {
        res.status(500).json({ message: "Error fetching apbdesas", error: err.message });
    }
});

// Get Penduduk by ID
router.get("/:id", async (req, res) => {
    try {
        const apbdesa = await Apbdesa.findById(req.params.id);
        if (!apbdesa) {
            return res.status(404).json({ message: "apbdesa not found" });
        }
        res.json(apbdesa);
    } catch (err) {
        res.status(500).json({ message: "Error fetching apbdesa", error: err.message });
    }
});

// Delete apbdesa by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const apbdesa = await Apbdesa.findByIdAndDelete(req.params.id);
      if (!apbdesa) return res.status(404).json({ message: "apbdesa not found" });
  
      res.json({ message: "apbdesa deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting apbdesa", error: err.message });
    }
});

// Update penduduk by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { pengeluaranDesa, pendapatanDesa, } = req.body;

    try {
      const updatedApbdesa = await Apbdesa.findByIdAndUpdate(
        req.params.id,
        {
          pengeluaranDesa,
          pendapatanDesa,
        },
        { new: true } // Return apb yang telah diperbarui
      );

      if (!updatedApbdesa) {
        return res.status(404).json({ message: "Apb not found" });
      }

      res.json(updatedApbdesa);
    } catch (err) {
      res.status(500).json({ message: "Error updating Apb", error: err.message });
    }
});

module.exports = router;
