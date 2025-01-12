const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");


const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, role: user.role }); // Kirimkan role bersama token
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Verify user (dashboard access)
router.get("/dashboard", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
});

// Verify admin (Admin panel access)
router.get("/adminpanel", authenticateToken, isAdmin, async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
});


// Get all users (admin only)
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      await User.deleteOne({ _id: user._id }); // Menggunakan deleteOne untuk menghapus user
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  


module.exports = router;
