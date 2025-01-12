const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config");
const path = require("path");


dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Ganti dengan URL frontend Anda
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/documents", express.static(path.join(__dirname, "documents")));

app.use("/api/auth", require("./routes/auth")); //Route untuk auth
app.use("/api/products", require("./routes/product")); // Route untuk produk/umkm
app.use("/api/applications", require("./routes/application")); // Route untuk surat pengajuan
app.use("/api/websites", require("./routes/website")); // Route untuk edit website/landingpage
app.use("/api/penduduks", require("./routes/penduduk")); // Route untuk penduduk
app.use("/api/apbdesas", require("./routes/apbdesa")); // Route untuk abpd
app.use("/api/beritas", require("./routes/berita")); // Route untuk berita
app.use("/api/visimisis", require("./routes/visimisi")); // Route untuk visi misi
app.use("/api/sejarahs", require("./routes/sejarah")); // Route untuk visi misi
app.use("/api/pendidikans", require("./routes/pendidikan")); // Route untuk visi misi
app.use("/api/pekerjaans", require("./routes/pekerjaan")); // Route untuk visi misi
app.use("/api/perangkats", require("./routes/perangkatdesa")); // Route untuk visi misi
app.use("/api/perwakilans", require("./routes/perwakilandesa")); // Route untuk visi misi
app.use("/api/lpms", require("./routes/lpm")); // Route untuk visi misi
app.use("/api/kass", require("./routes/kas")); // Route untuk visi misi


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
