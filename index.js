const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();
const app = express();


// Middleware keamanan: Helmet untuk header HTTP
app.use(helmet());

// Middleware keamanan: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 1000, // Maksimal 100 permintaan per IP
    message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
});
app.use(limiter);

// Middleware CORS
const allowedOrigins = ["http://localhost:5173", "https://cibuniasih.vercel.app/"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/documents", express.static(path.join(__dirname, "documents")));

app.use("/api/v1/auth", require("./routes/auth")); //Route untuk auth
app.use("/api/v1/products", require("./routes/product")); // Route untuk produk/umkm
app.use("/api/v1/applications", require("./routes/application")); // Route untuk surat pengajuan
app.use("/api/v1/websites", require("./routes/website")); // Route untuk edit website/landingpage
app.use("/api/v1/penduduks", require("./routes/penduduk")); // Route untuk penduduk
app.use("/api/v1/apbdesas", require("./routes/apbdesa")); // Route untuk abpd
app.use("/api/v1/beritas", require("./routes/berita")); // Route untuk berita
app.use("/api/v1/visimisis", require("./routes/visimisi")); // Route untuk visi misi
app.use("/api/v1/sejarahs", require("./routes/sejarah")); // Route untuk visi misi
app.use("/api/v1/pendidikans", require("./routes/pendidikan")); // Route untuk visi misi
app.use("/api/v1/pekerjaans", require("./routes/pekerjaan")); // Route untuk visi misi
app.use("/api/v1/perangkats", require("./routes/perangkatdesa")); // Route untuk visi misi
app.use("/api/v1/perwakilans", require("./routes/perwakilandesa")); // Route untuk visi misi
app.use("/api/v1/lpms", require("./routes/lpm")); // Route untuk visi misi
app.use("/api/v1/kass", require("./routes/kas")); // Route untuk visi misi
app.use("/api/v1/dusuns", require("./routes/dusun")); // Route untuk visi misi
app.use("/api/v1/peribadatans", require("./routes/peribadatan")); // Route untuk visi misi


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
