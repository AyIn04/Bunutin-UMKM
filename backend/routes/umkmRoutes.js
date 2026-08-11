const express = require("express");
const UMKM = require("../models/UMKM");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "umkm-desa-bunutin",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

// =========================
// GET semua UMKM
// =========================
router.get("/", async (req, res) => {
  try {
    const data = await UMKM.find().sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data UMKM",
      error: error.message,
    });
  }
});

// =========================
// GET UMKM berdasarkan ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const data = await UMKM.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "UMKM tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail UMKM",
      error: error.message,
    });
  }
});

// =========================
// POST tambah UMKM
// =========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = new UMKM(req.body);

    const savedData = await data.save();

    res.status(201).json({
      message: "UMKM berhasil ditambahkan",
      data: savedData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal menambahkan UMKM",
      error: error.message,
    });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    {
      name: "gambar",
      maxCount: 1,
    },
    {
      name: "galeri",
      maxCount: 10,
    },
  ]),
  async (req, res) => {
    try {
      const gambarUtama = req.files?.gambar?.[0];
      const fotoGaleri = req.files?.galeri || [];

      if (!gambarUtama && fotoGaleri.length === 0) {
        return res.status(400).json({
          message: "Minimal satu gambar harus dipilih",
        });
      }

      // =========================
      // Upload gambar utama
      // =========================

      let gambarUrl = "";

      if (gambarUtama) {
        const result = await uploadToCloudinary(
          gambarUtama.buffer
        );

        gambarUrl = result.secure_url;
      }

      // =========================
      // Upload galeri
      // =========================

      const galeriUrl = [];

      for (const foto of fotoGaleri) {
        const result = await uploadToCloudinary(
          foto.buffer
        );

        galeriUrl.push(result.secure_url);
      }

      // =========================
      // Response
      // =========================

      res.json({
        message: "Gambar berhasil diupload",

        gambar: gambarUrl,

        galeri: galeriUrl,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal upload gambar",
        error: error.message,
      });
    }
  }
);

// =========================
// PUT edit UMKM
// =========================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedData = await UMKM.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "UMKM tidak ditemukan",
      });
    }

    res.json({
      message: "UMKM berhasil diperbarui",
      data: updatedData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal memperbarui UMKM",
      error: error.message,
    });
  }
});

// =========================
// DELETE UMKM
// =========================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedData = await UMKM.findByIdAndDelete(req.params.id);

    if (!deletedData) {
      return res.status(404).json({
        message: "UMKM tidak ditemukan",
      });
    }

    res.json({
      message: "UMKM berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus UMKM",
      error: error.message,
    });
  }
});

module.exports = router;