const express = require("express");
const { uploadApp, cloudinary } = require("../utils/cloudinary");
const Application = require("../models/Application");
const router = express.Router();

const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require("path");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

// Submit Application
// Submit Application
router.post(
    "/uploadapp",
    uploadApp.fields([{ name: "fotoKtp" }, { name: "fotoKk" }, { name: "fotoLokasiUsaha" }, { name: "fotoLokasiTanah" }]), authenticateToken,
    async (req, res) => {
        const {
            nama,
            nik,
            kk,
            jenisKelamin,
            tempatTanggalLahir,
            pendidikan,
            statusPerkawinan,
            kewarganegaraan,
            pekerjaan,
            alamatSebelumnya,
            alamatSekarang,
            namaLembaga,
            ketua,
            tahunBerdiri,
            alamatLengkap,
            noIdDtks,
            kontak,
            alamatPerusahaan,
            bidangUsaha,
            jasaDagangUtama,
            keadaanUsahaSaatIni,
            diagnosaPenyakit,
            kepalaKeluarga,
            kelurahan,
            kecamatan,
            alamatTujuanPindah,
            jenisKepindahan,
            klasifikasiPindah,
            statusKkygTdkPindah,
            statusKkygPindah,
            keluargaygPindah,
            agama,
            bentukPerusahaan,
            npwp,
            alasan,
            type

        } = req.body;
        const userId = req.user.id; // Ambil ID pengguna dari token

        // Mendapatkan URL gambar dari Cloudinary
        const fotoKtpUrl = req.files.fotoKtp?.[0]?.path;
        const fotoKkUrl = req.files.fotoKk?.[0]?.path;
        const fotoLokasiUsahaUrl = req.files.fotoLokasiUsaha?.[0]?.path;
        const fotoLokasiTanahUrl = req.files.fotoLokasiTanah?.[0]?.path;

        //Validasi (SKDP)
        if (type === "SKDP") {
            if (!nama || !nik || !jenisKelamin || !tempatTanggalLahir || !pendidikan || !agama || !statusPerkawinan || !kewarganegaraan || !pekerjaan || !alamatSebelumnya || !alamatSekarang || !fotoKtpUrl || !fotoKkUrl)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        //Validasi (SKPL)
        if (type === "SKDL") {
            if (!namaLembaga || !ketua || !tahunBerdiri || !alamatLengkap)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        //Validasi (SKTM)
        if (type === "SKTM") {
            if (!nama || !kk || !nik || !jenisKelamin || !tempatTanggalLahir || !noIdDtks || !pekerjaan || !alamatLengkap)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        //Validasi (SKU)
        if (type === "SKU") {
            if (!nama || !nik || !tempatTanggalLahir || !bentukPerusahaan || !npwp || !alamatPerusahaan || !alamatLengkap || !bidangUsaha || !jasaDagangUtama || !keadaanUsahaSaatIni || !fotoKtpUrl)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        //Validasi (SPBS)
        if (type === "SPBS") {
            if (!nama || !kk || !nik || !kk || !tempatTanggalLahir || !jenisKelamin || !pekerjaan || !diagnosaPenyakit || !alamatLengkap)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        //Validasi (SKPD)
        if (type === "SKPD") {
            if (!kk || !kepalaKeluarga || !alamatSebelumnya || !kelurahan || !kecamatan || !kontak || !nik || !nama || !alasan || !alamatTujuanPindah || !jenisKepindahan || !klasifikasiPindah || !statusKkygTdkPindah || !statusKkygPindah || !keluargaygPindah)
                return res
                    .status(400)
                    .json({ message: "Foto lokasi usaha wajib diunggah untuk tipe 'sku'" });
        }

        try {

            if (!["SKDP", "SKDL", "SKTM", "SKU", "SPBS", "SKPD"].includes(type)) {
                return res.status(400).json({ message: "Invalid application type" });
            }

            const application = new Application({
                nama,
                nik,
                kk,
                jenisKelamin,
                tempatTanggalLahir,
                pendidikan,
                statusPerkawinan,
                kewarganegaraan,
                pekerjaan,
                alamatSebelumnya,
                alamatSekarang,
                namaLembaga,
                ketua,
                tahunBerdiri,
                alamatLengkap,
                noIdDtks,
                kontak,
                alamatPerusahaan,
                bidangUsaha,
                jasaDagangUtama,
                keadaanUsahaSaatIni,
                diagnosaPenyakit,
                kepalaKeluarga,
                kelurahan,
                kecamatan,
                alamatTujuanPindah,
                jenisKepindahan,
                klasifikasiPindah,
                statusKkygTdkPindah,
                statusKkygPindah,
                keluargaygPindah,
                agama,
                bentukPerusahaan,
                npwp,
                alasan,

                //foto
                fotoLokasiTanah: fotoLokasiTanahUrl,
                fotoLokasiUsaha: fotoLokasiUsahaUrl,
                fotoKtp: fotoKtpUrl,
                fotoKk: fotoKkUrl,

                user: userId, // Simpan ID pengguna
                type
            });
            await application.save();
            res.status(201).json(application);
        } catch (err) {
            res.status(500).json({ message: "Error creating application", error: err.message });
        }
    }
);



router.get("/my-applications", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const applications = await Application.find({ user: userId });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications", error: err.message });
    }
});




// Get Applications (Admin) with Filter by Type
router.get("/", authenticateToken, isAdmin, async (req, res) => {
    const { type } = req.query; // Ambil tipe dari query parameter

    try {
        // Jika `type` ada, tambahkan ke filter, jika tidak, ambil semua
        const filter = type ? { type } : {};
        const applications = await Application.find(filter).sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications", error: err.message });
    }
});

// Update application status and generate PDF
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { status, adminNotes, kop1, kop2, kop3, kop4 } = req.body;

    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = status;
        application.adminNotes = adminNotes;
        application.kop1 = kop1;
        application.kop2 = kop2;
        application.kop3 = kop3;
        application.kop4 = kop4;

        // Jika status disetujui, buat PDF dan unggah ke Cloudinary
        if (status === "Disetujui") {
            const pdfPath = path.join(__dirname, `../documents/${application._id}.pdf`);
            // Baca file logo dan ubah menjadi Base64
            const logoBase64 = fs.readFileSync(path.resolve(__dirname, '../assets/logo.png')).toString('base64');
            const logoDataUrl = `data:image/png;base64,${logoBase64}`;


            // Siapkan konten HTML untuk masing-masing jenis surat
            let content = '';
            if (application.type === "SKDP") {
                content = `
                    <html>

                    <head>
                        <style>
                            body {
                                font-family: 'Times New Roman', Times, serif;
                                padding: 2.54cm 2.54cm;
                                line-height: 1.8;
                                width: 21cm;
                                height: 29.7cm;
                            }

                            .header {
                                position: relative;
                                text-align: center;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-bottom: 4px solid black;
                                /* Garis di bawah header */
                                padding-bottom: 10px;
                                /* Spasi antara teks dan garis */
                            }

                            .logo {
                                width: 100px;
                                height: 100px;
                                position: absolute;
                                left: 20px;
                                top: 50%;
                                transform: translateY(-50%);
                            }

                            .teksHeader {
                                font-weight: bold;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                flex-grow: 1;
                            }

                            .teksHeader h1 {
                                margin: 2px 0;
                                /* Mengurangi margin atas dan bawah */
                                line-height: 1.2;
                                /* Mengurangi jarak antar baris */
                                font-size: 20px;
                            }

                            .teksHeader p {
                                margin: 2px 0;
                                /* Mengurangi margin atas dan bawah */
                                line-height: 1.2;
                                /* Mengurangi jarak antar baris */
                                font-weight: normal;
                                font-size: 16px;
                            }

                            .judulSurat {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                flex-direction: column;
                            }

                            .judulSurat h2 {
                                font-size: 18px;
                                font-weight: bold;
                                text-decoration: underline;
                            }

                            .judulSurat p {
                                margin: -15px;
                                /* Mengurangi margin atas dan bawah */
                                line-height: 1.2;
                                /* Mengurangi jarak antar baris */
                                font-weight: normal;
                                font-size: 16px;
                            }

                            p,
                            table {
                                font-size: 16px;
                            }

                            table {
                                width: 100%;
                                margin-top: 20px;
                                border-collapse: collapse;
                            }

                            table td {
                                vertical-align: top;
                                padding: 5px;
                            }

                            hr {
                                border: none;
                                border-top: 1px solid black;
                                /* Bisa diubah sesuai warna */
                                transform: scaleY(0.8);
                                /* Mengurangi tebal border menjadi 0.5px */
                                margin: 2px 0;
                                /* Menambahkan sedikit jarak */

                            }

                            .signature {
                                text-align: right;
                                margin-top: 50px;
                            }
                        </style>
                    </head>

                    <body>
                        <!-- header -->
                        <div class="header">
                            <img class="logo" src="${logoDataUrl}">
                            <div class="teksHeader">
                                <h1>PEMERINTAH DAERAH KABUPATEN TASIKMALAYA</h1>
                                <h1>KECAMATAN PANCATENGAH</h1>
                                <h1>DESA CIBUNIASIH</h1>
                                <p>Jln Nagaratengah Nomor Kode Pos 46194</p>
                            </div>
                        </div>
                        <hr>

                        <!-- Judul SUrat -->
                        <br>
                        <div class="judulSurat">
                            <h2>SURAT KETERANGAN DOMISILI</h2>
                            <p>Nomor: ${kop1}/${kop2}/${kop3}/${kop4}</p>
                        </div>
                        <br>

                        <p>Yang bertanda tangan di bawah ini, Kepala Desa Cibuniasih, Kecamatan Pancatengah, Kabupaten Tasikmalaya,
                            menerangkan bahwa:</p>
                        <table>
                            <tr>
                                <td style="width: 25%;">Nama</td>
                                <td>: ${application.nama}</td>
                            </tr>
                            <tr>
                                <td>NIK</td>
                                <td>: ${application.nik}</td>
                            </tr>
                            <tr>
                                <td>Jenis Kelamin</td>
                                <td>: ${application.jenisKelamin}</td>
                            </tr>
                            <tr>
                                <td>Tempat Tanggal Lahir</td>
                                <td>: ${application.tempatTanggalLahir}</td>
                            </tr>
                            <tr>
                                <td>Pendidikan</td>
                                <td>: ${application.pendidikan}</td>
                            </tr>
                            <tr>
                                <td>Agama</td>
                                <td>: ${application.agama}</td>
                            </tr>
                            <tr>
                                <td>Status Perkawinan</td>
                                <td>: ${application.statusPerkawinan}</td>
                            </tr>
                            <tr>
                                <td>Kewarganegaraan</td>
                                <td>: ${application.kewarganegaraan}</td>
                            </tr>
                            <tr>
                                <td>Pekerjaan</td>
                                <td>: ${application.pekerjaan}</td>
                            </tr>
                            <tr>
                                <td>Alamat</td>
                                <td>: ${application.alamatSebelumnya}</td>
                            </tr>
                        </table>

                        <p>Namun saat ini orang tersebut di atas sedang tinggal dan berdomisili di:</p>

                        <table>
                            <tr>
                                <td style="width: 25%;">Alamat</td>
                                <td>: ${application.alamatSekarang}</td>
                            </tr>
                        </table>
                        <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar yang berkepentingan mengetahuinya dan dapat digunakan
                            sebagaimana mestinya.</p>
                        <br>
                        <div class="signature">
                            <p>Cibuniasih, ${new Date().toLocaleDateString()}</p>
                            <p style="margin-top: -20px;">Kepala Desa Cibuniasih</p>
                            <br><br><br>
                            <p><b style="text-decoration: underline;">H. Anwar</b></p>
                        </div>

                    </body>

                    </html>`;
                    
            } else if (application.type === "SKU") {
                content = 
                `<html>
                <head>
                    <style>
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            padding: 2.54cm 2.54cm;
                            line-height: 1.8;
                            width: 21cm;
                            height: 29.7cm;
                        }

                        .header {
                            position: relative;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-bottom: 4px solid black;
                            /* Garis di bawah header */
                            padding-bottom: 10px;
                            /* Spasi antara teks dan garis */
                        }

                        .logo {
                            width: 100px;
                            height: 100px;
                            position: absolute;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        .teksHeader {
                            font-weight: bold;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            flex-grow: 1;
                        }

                        .teksHeader h1 {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-size: 20px;
                        }

                        .teksHeader p {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        .judulSurat {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }

                        .judulSurat h2 {
                            font-size: 18px;
                            font-weight: bold;
                            text-decoration: underline;
                        }

                        .judulSurat p {
                            margin: -15px;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        p,
                        table {
                            font-size: 16px;
                        }

                        table {
                            width: 100%;
                            margin-top: 20px;
                            border-collapse: collapse;
                        }

                        table td {
                            vertical-align: top;
                            padding: 5px;
                        }

                        hr {
                            border: none;
                            border-top: 1px solid black;
                            /* Bisa diubah sesuai warna */
                            transform: scaleY(0.8);
                            /* Mengurangi tebal border menjadi 0.5px */
                            margin: 2px 0;
                            /* Menambahkan sedikit jarak */

                        }

                        .signature {
                            text-align: right;
                            margin-top: 50px;
                        }
                    </style>
                </head>

                <body>
                    <!-- header -->
                    <div class="header">
                        <img class="logo" src="${logoDataUrl}">
                        <div class="teksHeader">
                            <h1>PEMERINTAH DAERAH KABUPATEN TASIKMALAYA</h1>
                            <h1>KECAMATAN PANCATENGAH</h1>
                            <h1>DESA CIBUNIASIH</h1>
                            <p>Jln Nagaratengah Nomor Kode Pos 46194</p>
                        </div>
                    </div>
                    <hr>

                    <!-- Judul SUrat -->
                    <br>
                    <div class="judulSurat">
                        <h2>SURAT KETERANGAN USAHA</h2>
                        <p>Nomor: ${kop1}/${kop2}/${kop3}/${kop4}</p>
                    </div>
                    <br>

                    <p>Yang bertanda tangan di bawah ini, Kepala Desa Cibuniasih, Kecamatan Pancatengah, Kabupaten Tasikmalaya,
                        menerangkan bahwa:</p>
                    <table>
                        <tr>
                            <td style="width: 25%;">Nama</td>
                            <td>: ${application.nama}</td>
                        </tr>
                        <tr>
                            <td>NIK</td>
                            <td>: ${application.nik}</td>
                        </tr>
                        <tr>
                            <td>Tempat Tanggal Lahir</td>
                            <td>: ${application.tempatTanggalLahir}</td>
                        </tr>
                        <tr>
                            <td>Bentuk Perusahaan</td>
                            <td>: ${application.bentukPerusahaan}</td>
                        </tr>
                        <tr>
                            <td>NPWP</td>
                            <td>: ${application.npwp || '-'}</td>
                        </tr>
                        <tr>
                            <td>Alamat Perusahaan</td>
                            <td>: ${application.alamatPerusahaan}</td>
                        </tr>
                        <tr>
                            <td>Alamat Tempat Tinggal</td>
                            <td>: ${application.alamatLengkap}</td>
                        </tr>
                        <tr>
                            <td>Bidang Usaha</td>
                            <td>: ${application.bidangUsaha}</td>
                        </tr>
                        <tr>
                            <td>Jasa Dagang Utama</td>
                            <td>: ${application.jasaDagangUtama}</td>
                        </tr>
                        <tr>
                            <td>Keadaan Usaha Saat ini</td>
                            <td>: ${application.keadaanUsahaSaatIni}</td>
                        </tr>
                    </table>

                    <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar yang berkepentingan mengetahuinya dan dapat digunakan
                        sebagaimana mestinya.</p>
                    <br>
                    <div class="signature">
                        <p>Cibuniasih, ${new Date().toLocaleDateString()}</p>
                        <p style="margin-top: -20px;">Kepala Desa Cibuniasih</p>
                        <br><br><br>
                        <p><b style="text-decoration: underline;">H. Anwar</b></p>
                    </div>

                </body>

                </html>`
  
            } else if (application.type === "SKDL") {
                content = `
                <html>

                <head>
                    <style>
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            padding: 2.54cm 2.54cm;
                            line-height: 1.8;
                            width: 21cm;
                            height: 29.7cm;
                        }

                        .header {
                            position: relative;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-bottom: 4px solid black;
                            /* Garis di bawah header */
                            padding-bottom: 10px;
                            /* Spasi antara teks dan garis */
                        }

                        .logo {
                            width: 100px;
                            height: 100px;
                            position: absolute;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        .teksHeader {
                            font-weight: bold;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            flex-grow: 1;
                        }

                        .teksHeader h1 {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-size: 20px;
                        }

                        .teksHeader p {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        .judulSurat {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }

                        .judulSurat h2 {
                            font-size: 18px;
                            font-weight: bold;
                            text-decoration: underline;
                        }

                        .judulSurat p {
                            margin: -15px;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        p,
                        table {
                            font-size: 16px;
                        }

                        table {
                            width: 100%;
                            margin-top: 20px;
                            border-collapse: collapse;
                        }

                        table td {
                            vertical-align: top;
                            padding: 5px;
                        }

                        hr {
                            border: none;
                            border-top: 1px solid black;
                            /* Bisa diubah sesuai warna */
                            transform: scaleY(0.8);
                            /* Mengurangi tebal border menjadi 0.5px */
                            margin: 2px 0; /* Menambahkan sedikit jarak */

                        }

                        .signature {
                            text-align: right;
                            margin-top: 50px;
                        }
                    </style>
                </head>

                <body>
                    <!-- header -->
                    <div class="header">
                        <img class="logo" src="${logoDataUrl}">
                        <div class="teksHeader">
                            <h1>PEMERINTAH DAERAH KABUPATEN TASIKMALAYA</h1>
                            <h1>KECAMATAN PANCATENGAH</h1>
                            <h1>DESA CIBUNIASIH</h1>
                            <p>Jln Nagaratengah Nomor Kode Pos 46194</p>
                        </div>
                    </div>
                    <hr>

                    <!-- Judul SUrat -->
                    <br>
                    <div class="judulSurat">
                        <h2>SURAT KETERANGAN DOMISILI</h2>
                        <p>Nomor: ${kop1}/${kop2}/${kop3}/${kop4}</p>
                    </div>
                    <br>

                    <p>Yang bertanda tangan di bawah ini, Kepala Desa Cibuniasih, Kecamatan Pancatengah, Kabupaten Tasikmalaya,
                        menerangkan bahwa:</p>
                    <table>
                        <tr>
                            <td style="width: 25%;">Nama Lembaga</td>
                            <td>: ${application.namaLembaga}</td>
                        </tr>
                        <tr>
                            <td>Ketua</td>
                            <td>: ${application.ketua}</td>
                        </tr>
                        <tr>
                            <td>Tahun Berdiri</td>
                            <td>: ${application.tahunBerdiri}</td>
                        </tr>
                        <tr>
                            <td>Alamat Lengkap</td>
                            <td>: ${application.alamatLengkap}</td>
                        </tr>
                    </table>

                    <p>Nama lembaga tersebut di atas benar-benar berada di Desa kami dan berdomisili sebagaimana tercantum di atas.</p>

                    <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar yang berkepentingan mengetahuinya dan dapat digunakan
                        sebagaimana mestinya.</p>
                    <br>
                    <div class="signature">
                        <p>Cibuniasih, ${new Date().toLocaleDateString()}</p>
                        <p style="margin-top: -20px;">Kepala Desa Cibuniasih</p>
                        <br><br><br>
                        <p><b style="text-decoration: underline;">H. Anwar</b></p>
                    </div>

                </body>

                </html>`
            } else if (application.type === "SKTM") {
                content = `
                <html>

                <head>
                    <style>
                        body {
                            font-family: 'Times New Roman', Times, serif;
                            padding: 2.54cm 2.54cm;
                            line-height: 1.8;
                            width: 21cm;
                            height: 29.7cm;
                        }

                        .header {
                            position: relative;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-bottom: 4px solid black;
                            /* Garis di bawah header */
                            padding-bottom: 10px;
                            /* Spasi antara teks dan garis */
                        }

                        .logo {
                            width: 100px;
                            height: 100px;
                            position: absolute;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        .teksHeader {
                            font-weight: bold;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            flex-grow: 1;
                        }

                        .teksHeader h1 {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-size: 20px;
                        }

                        .teksHeader p {
                            margin: 2px 0;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        .judulSurat {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }

                        .judulSurat h2 {
                            font-size: 18px;
                            font-weight: bold;
                            text-decoration: underline;
                        }

                        .judulSurat p {
                            margin: -15px;
                            /* Mengurangi margin atas dan bawah */
                            line-height: 1.2;
                            /* Mengurangi jarak antar baris */
                            font-weight: normal;
                            font-size: 16px;
                        }

                        p,
                        table {
                            font-size: 16px;
                        }

                        table {
                            width: 100%;
                            margin-top: 20px;
                            border-collapse: collapse;
                        }

                        table td {
                            vertical-align: top;
                            padding: 5px;
                        }

                        hr {
                            border: none;
                            border-top: 1px solid black;
                            /* Bisa diubah sesuai warna */
                            transform: scaleY(0.8);
                            /* Mengurangi tebal border menjadi 0.5px */
                            margin: 2px 0;
                            /* Menambahkan sedikit jarak */

                        }

                        .signatures {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 50px;
                        }

                        .signature-box {
                            text-align: center;
                            width: 30%;
                            /* Mengatur lebar kotak */
                        }
                    </style>
                </head>

                <body>
                    <!-- header -->
                    <div class="header">
                        <img class="logo" src="${logoDataUrl}">
                        <div class="teksHeader">
                            <h1>PEMERINTAH DAERAH KABUPATEN TASIKMALAYA</h1>
                            <h1>KECAMATAN PANCATENGAH</h1>
                            <h1>DESA CIBUNIASIH</h1>
                            <p>Jln Nagaratengah Nomor Kode Pos 46194</p>
                        </div>
                    </div>
                    <hr>

                    <!-- Judul SUrat -->
                    <br>
                    <div class="judulSurat">
                        <h2>SURAT KETERANGAN TIDAK MAMPU</h2>
                        <p>Nomor: ${kop1}/${kop2}/${kop3}/${kop4}</p>
                    </div>
                    <br>

                    <p>Yang bertanda tangan di bawah ini, Kepala Desa Cibuniasih, Kecamatan Pancatengah, Kabupaten Tasikmalaya,
                        menerangkan bahwa:</p>
                    <table>
                        <tr>
                            <td style="width: 25%;">Nama</td>
                            <td>: ${application.nama}</td>
                        </tr>
                        <tr>
                            <td>NIK</td>
                            <td>: ${application.nik}</td>
                        </tr>
                        <tr>
                            <td>KK</td>
                            <td>: ${application.kk}</td>
                        </tr>
                        <tr>
                            <td>Jenis Kelamin</td>
                            <td>: ${application.jenisKelamin}</td>
                        </tr>
                        <tr>
                            <td>Tempat Tanggal Lahir</td>
                            <td>: ${application.tempatTanggalLahir}</td>
                        </tr>
                        <tr>
                            <td>No. ID DTKS</td>
                            <td>: ${application.noIdDtks}</td>
                        </tr>
                        <tr>
                            <td>Pekerjaan</td>
                            <td>: ${application.pekerjaan}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td>: ${application.alamatLengkap}</td>
                        </tr>
                    </table>

                    <p>Nama Orang tersebut diatas hasil validasi kami ke lapangan benar-benar TIDAK MAMPU, dan Surat Keterangan yang Kami maksud untuk keperluan Persyaratan Permohonan Bantuan Perihal Ekonomi.</p>

                    <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar yang berkepentingan mengetahuinya dan dapat digunakan
                        sebagaimana mestinya.</p>
                    <br>
                    <div class="signatures">
                        <div class="signature-box">
                            <p>Mengetahui,</p>
                            <p style="margin-top: -20px;">Camat Pancatengah</p>
                            <br><br><br>
                            <p><b style="text-decoration: underline;"></b></p>
                        </div>
                        <div class="signature-box">
                            <p>Cibuniasih, ${new Date().toLocaleDateString()}</p>
                            <p style="margin-top: -20px;">Kepala Desa Cibuniasih</p>
                            <br><br><br>
                            <p><b style="text-decoration: underline;">H. Anwar</b></p>
                        </div>
                        <div class="signature-box">
                            <p>Disaksikan oleh,</p>
                            <p style="margin-top: -20px;">Sekretaris Desa</p>
                            <br><br><br>
                            <p><b style="text-decoration: underline;"></b></p>
                        </div>
                    </div>


                </body>

                </html>`
            }

            // Gunakan Puppeteer untuk membuat PDF
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(content);
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
            await browser.close();

            // Unggah ke Cloudinary
            const result = await cloudinary.uploader.upload(pdfPath, {
                resource_type: "raw",
                folder: "pdf_files",
                use_filename: true,
                unique_filename: false,
                access_mode: "public",
            });

            // Hapus file lokal setelah diunggah
            fs.unlinkSync(pdfPath);

            // Simpan URL PDF ke database
            application.pdfPath = result.secure_url;
        }

        // Simpan perubahan di database
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating application", error: err.message });
    }
});

// Delete Application
// Delete Application
// Delete Application
// Delete Application
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Hapus gambar KTP dan KK dari Cloudinary
        const deleteImages = async (imageUrl) => {
            if (!imageUrl) return;

            try {
                // Extract public_id dari URL
                const imageUrlObj = new URL(imageUrl); // Parse URL
                const pathParts = imageUrlObj.pathname.split("/"); // Pisahkan path
                const fileName = pathParts[pathParts.length - 1]; // Nama file lengkap
                const publicId = `application/${fileName.split(".")[0]}`; // Sertakan nama file lengkap tanpa ekstensi

                // Hapus file dari Cloudinary
                const result = await cloudinary.uploader.destroy(publicId);
                console.log(`Image ${publicId} deleted from Cloudinary`, result);
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err.message);
                throw new Error("Failed to delete image from Cloudinary");
            }
        };

        // Hapus KTP dan KK
        await deleteImages(application.ktp);
        await deleteImages(application.kk);

        // Hapus file PDF jika ada
        if (application.pdfPath) {
            try {
                const pdfUrl = new URL(application.pdfPath);
                const pathParts = pdfUrl.pathname.split("/");
                const fileName = pathParts[pathParts.length - 1];
                const publicId = `pdf_files/${fileName}`;

                const result = await cloudinary.uploader.destroy(publicId, {
                    resource_type: "raw",
                });
                console.log(`PDF ${publicId} deleted from Cloudinary`, result);
            } catch (err) {
                console.error("Error deleting PDF from Cloudinary:", err.message);
                throw new Error("Failed to delete PDF from Cloudinary");
            }
        }

        // Hapus application dari database
        await application.deleteOne();

        res.json({ message: "Application and associated files deleted successfully" });
    } catch (err) {
        console.error("Error deleting application:", err.message);
        res.status(500).json({ message: "Error deleting application", error: err.message });
    }
});





module.exports = router;