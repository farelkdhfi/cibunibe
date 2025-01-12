const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const Sejarah = require("../models/Sejarah");
const router = express.Router();

// Tambahkan penduduk
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
    const { sejarahDesa, } = req.body;

    try {
        const newSejarah = new Sejarah({
          sejarahDesa,
        });

        await newSejarah.save();
        res.status(201).json(newSejarah);
    } catch (err) {
        res.status(500).json({ message: "Error adding content", error: err.message });
    }
});

// Get all apb
router.get("/", async (req, res) => {
    try {
        const sejarahdesas = await Sejarah.find();
        res.json(sejarahdesas);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sejarahdesas", error: err.message });
    }
});

// Get Penduduk by ID
router.get("/:id", async (req, res) => {
    try {
        const sejarahdesa = await Sejarah.findById(req.params.id);
        if (!sejarahdesa) {
            return res.status(404).json({ message: "sejarahdesa not found" });
        }
        res.json(sejarahdesa);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sejarahdesa", error: err.message });
    }
});

// Delete apbdesa by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const sejarahdesa = await Sejarah.findByIdAndDelete(req.params.id);
      if (!sejarahdesa) return res.status(404).json({ message: "sejarahdesa not found" });
  
      res.json({ message: "sejarahdesa deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting sejarahdesa", error: err.message });
    }
});

// Update penduduk by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { sejarahDesa, } = req.body;

    try {
      const updatedSejarahdesa = await Sejarah.findByIdAndUpdate(
        req.params.id,
        {
          sejarahDesa,
        },
        { new: true } // Return apb yang telah diperbarui
      );

      if (!updatedSejarahdesa) {
        return res.status(404).json({ message: "Apb not found" });
      }

      res.json(updatedSejarahdesa);
    } catch (err) {
      res.status(500).json({ message: "Error updating Sejarah", error: err.message });
    }
});

module.exports = router;
