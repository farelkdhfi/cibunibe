const express = require("express");
const router = express.Router();
const { uploadWeb } = require("../utils/cloudinary");
const Website = require("../models/Website");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

// Tambah struktur dengan upload gambar
router.post(
  "/add", authenticateToken, isAdmin,
  uploadWeb.fields([
    { name: "fotoKepalaDesa" },
    { name: "fotoSekretarisDesa" },
    { name: "fotoKasiPemerintahan" },
    { name: "fotoKasiKesra" },
  ]),
  async (req, res) => {
    const {
      sambutan,
      namaKepalaDesa,
      namaSekretarisDesa,
      namaKasiPemerintahan,
      namaKasiKesra,
    } = req.body;

    const fotoKepalaDesaUrl = req.files.fotoKepalaDesa?.[0]?.path || null;
    const fotoSekretarisDesaUrl = req.files.fotoSekretarisDesa?.[0]?.path || null;
    const fotoKasiPemerintahanUrl = req.files.fotoKasiPemerintahan?.[0]?.path || null;
    const fotoKasiKesraUrl = req.files.fotoKasiKesra?.[0]?.path || null;

    if (
      !sambutan ||
      !namaKepalaDesa ||
      !namaSekretarisDesa ||
      !namaKasiPemerintahan ||
      !namaKasiKesra
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newWebsite = new Website({
        sambutan,
        namaKepalaDesa,
        namaSekretarisDesa,
        namaKasiPemerintahan,
        namaKasiKesra,
        fotoKepalaDesa: fotoKepalaDesaUrl,
        fotoSekretarisDesa: fotoSekretarisDesaUrl,
        fotoKasiPemerintahan: fotoKasiPemerintahanUrl,
        fotoKasiKesra: fotoKasiKesraUrl,
      });

      await newWebsite.save();
      res.status(201).json(newWebsite);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding content", error: err.message });
    }
  }
);

// Get all struktur
router.get("/", async (req, res) => {
  try {
    const websites = await Website.find();
    res.json(websites);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching content", error: err.message });
  }
});

// Get website by ID
router.get("/:id", async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) {
            return res.status(404).json({ message: "website not found" });
        }
        res.json(website);
    } catch (err) {
        res.status(500).json({ message: "Error fetching website", error: err.message });
    }
});

// Delete struktur by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const website = await Website.findByIdAndDelete(req.params.id);
    if (!website)
      return res.status(404).json({ message: "Content not found" });

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting content", error: err.message });
  }
});

// Update struktur by ID
router.put(
  "/:id", authenticateToken, isAdmin,
  uploadWeb.fields([
    { name: "fotoKepalaDesa" },
    { name: "fotoSekretarisDesa" },
    { name: "fotoKasiPemerintahan" },
    { name: "fotoKasiKesra" },
  ]),
  async (req, res) => {
    const {
      sambutan,
      namaKepalaDesa,
      namaSekretarisDesa,
      namaKasiPemerintahan,
      namaKasiKesra,
    } = req.body;

    const fotoKepalaDesaUrl = req.files.fotoKepalaDesa?.[0]?.path;
    const fotoSekretarisDesaUrl = req.files.fotoSekretarisDesa?.[0]?.path;
    const fotoKasiPemerintahanUrl = req.files.fotoKasiPemerintahan?.[0]?.path;
    const fotoKasiKesraUrl = req.files.fotoKasiKesra?.[0]?.path;

    try {
      const updatedWebsite = await Website.findByIdAndUpdate(
        req.params.id,
        {
          sambutan,
          namaKepalaDesa,
          namaSekretarisDesa,
          namaKasiPemerintahan,
          namaKasiKesra,
          ...(fotoKepalaDesaUrl && { fotoKepalaDesa: fotoKepalaDesaUrl }),
          ...(fotoSekretarisDesaUrl && { fotoSekretarisDesa: fotoSekretarisDesaUrl }),
          ...(fotoKasiPemerintahanUrl && { fotoKasiPemerintahan: fotoKasiPemerintahanUrl }),
          ...(fotoKasiKesraUrl && { fotoKasiKesra: fotoKasiKesraUrl }),
        },
        { new: true }
      );

      if (!updatedWebsite) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(updatedWebsite);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating website", error: err.message });
    }
  }
);

module.exports = router;
