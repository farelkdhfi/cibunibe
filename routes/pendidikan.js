const express = require("express");
const Pendidikan = require("../models/Pendidikan");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Tambahkan visi misi
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
    const { belumSekolah, tamatSd, tidakTamatSd, tamatSLTA, tamatPerguruanTinggi, madrasah, majelis } = req.body;

    try {
        const newVisimisi = new Pendidikan({
            belumSekolah,
            tamatSd,
            tidakTamatSd,
            tamatSLTA,
            tamatPerguruanTinggi,
            madrasah,
            majelis
        });

        await newVisimisi.save();
        res.status(201).json(newVisimisi);
    } catch (err) {
        res.status(500).json({ message: "Error adding pendidikan", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const visimisis = await Pendidikan.find();
        console.log(visimisis); // Debug respons dari database
        res.json(visimisis);
    } catch (err) {
        res.status(500).json({ message: "Error fetching visi misi", error: err.message });
    }
});


// Get visi misi by ID
router.get("/:id", async (req, res) => {
    try {
        const visimisi = await Pendidikan.findById(req.params.id);
        if (!visimisi) {
            return res.status(404).json({ message: "Pendidikan not found" });
        }
        res.json(visimisi);
    } catch (err) {
        res.status(500).json({ message: "Error fetching pendidikan", error: err.message });
    }
});


// Delete visi by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const visimisi = await Pendidikan.findByIdAndDelete(req.params.id);
        if (!visimisi) return res.status(404).json({ message: "pendidikan not found" });

        res.json({ message: "pendidikan deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting pendidikan", error: err.message });
    }
});

// Update visi misi by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { belumSekolah, tamatSd, tamatPerguruanTinggi, tamatSLTA, tidakTamatSd } = req.body;

    try {
        const updatedVisimisi = await Pendidikan.findByIdAndUpdate(
            req.params.id,
            {
                belumSekolah,
                tamatSd,
                tamatPerguruanTinggi,
                tamatSLTA,
                tidakTamatSd,
                majelis,
                madrasah
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
