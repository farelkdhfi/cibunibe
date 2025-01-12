const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('debug', true); // Menyalakan debug mode untuk koneksi
    await mongoose.connect(process.env.MONGO_URI); // Tidak perlu opsi tambahan
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
