const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const Product = require("../models/Product");
const { upload } = require("../utils/cloudinary");

// Tambahkan produk dengan upload gambar
router.post("/add", authenticateToken, isAdmin, upload.single("image"), async (req, res) => {
    const { namaProduct, deskripsiProduct, hargaProduct, kontak } = req.body;
    const imageUrl = req.file?.path; // URL gambar dari Cloudinary

    try {
        const newProduct = new Product({
            namaProduct,
            deskripsiProduct,
            hargaProduct,   
            kontak, 
            image: imageUrl,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: "Error adding product", error: err.message });
    }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 6 } = req.query; // Default: halaman 1, 6 product per halaman
  try {
      const products = await Product.find()
          .skip((page - 1) * limit) // Lewati product berdasarkan halaman
          .limit(parseInt(limit)); // Batasi jumlah product

      const totalProducts = await Product.countDocuments(); // Total product
      const totalPages = Math.ceil(totalProducts / limit); // Total halaman

      res.json({
          data: products,
          currentPage: parseInt(page),
          totalPages,
      });
  } catch (err) {
      res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});



// Get product details by ID dan tingkatkan jumlah views
const MINIMUM_VIEW_INCREMENT_DELAY = 5000; // 5 detik

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const now = new Date();
    const lastViewUpdate = product.updatedAt || product.createdAt;

    if (now - lastViewUpdate > MINIMUM_VIEW_INCREMENT_DELAY) {
      product.views += 1;
      product.updatedAt = now;
      await product.save();
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});


// Delete product by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "product not found" });
  
      res.json({ message: "product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product", error: err.message });
    }
  });

  // Update product by ID
router.put("/:id", authenticateToken, isAdmin, upload.single("image"), async (req, res) => {
    const { namaProduct, deskripsiProduct, hargaProduct, kontak } = req.body;
    let imageUrl;
  
    if (req.file) {
      imageUrl = req.file.path; // Jika ada file gambar baru, ambil URL dari Cloudinary
    }
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          namaProduct,
          deskripsiProduct,
          hargaProduct,
          kontak,
          ...(imageUrl && { image: imageUrl }), // Hanya perbarui gambar jika ada file baru
        },
        { new: true } // Return produk yang telah diperbarui
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: "Error updating product", error: err.message });
    }
  });  
  

module.exports = router;
