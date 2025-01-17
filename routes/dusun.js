const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const Dusun = require("../models/Dusun");
const router = express.Router();

// Tambahkan visi misi
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
    const { dusun, laki, perempuan, kk } = req.body;

    try {
        const newVisimisi = new Dusun({
          dusun,
          laki,
          perempuan,
          kk
        });

        await newVisimisi.save();
        res.status(201).json(newVisimisi);
    } catch (err) {
        res.status(500).json({ message: "Error adding visi misi", error: err.message });
    }
});

// Get all visi misi
router.get("/", async (req, res) => {
    try {
        const visimisis = await Dusun.find();
        res.json(visimisis);
    } catch (err) {
        res.status(500).json({ message: "Error fetching visi misi", error: err.message });
    }
});

// Get visi misi by ID
router.get("/:id", async (req, res) => {
    try {
        const visimisi = await Dusun.findById(req.params.id);
        if (!visimisi) {
            return res.status(404).json({ message: "Visi misi not found" });
        }
        res.json(visimisi);
    } catch (err) {
        res.status(500).json({ message: "Error fetching visi misi", error: err.message });
    }
});


// Delete visi by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const visimisi = await Dusun.findByIdAndDelete(req.params.id);
      if (!visimisi) return res.status(404).json({ message: "visimisi not found" });
  
      res.json({ message: "visimisi deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting visimisi", error: err.message });
    }
});

// Update visi misi by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { dusun, laki, perempuan, kk } = req.body;

    try {
      const updatedVisimisi = await Dusun.findByIdAndUpdate(
        req.params.id,
        {
          dusun,
          laki,
          perempuan,
          kk
        },
        { new: true } // Return visi misi yang telah diperbarui
      );

      if (!updatedVisimisi) {
        return res.status(404).json({ message: "Visi misi not found" });
      }

      res.json(updatedVisimisi);
    } catch (err) {
      res.status(500).json({ message: "Error updating visi misi", error: err.message });
    }
});

module.exports = router;
