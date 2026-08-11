const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// LOGIN ADMIN
// ======================================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    let admin = await Admin.findOne({ username });

    // ==================================================
    // ADMIN PERTAMA KALI
    // Ambil dari .env
    // ==================================================
    if (!admin) {
      const envUsername = process.env.ADMIN_USERNAME;
      const envPasswordHash = process.env.ADMIN_PASSWORD;

      if (username !== envUsername) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }

      if (!envPasswordHash) {
        return res.status(500).json({
          message:
            "Konfigurasi password admin di server belum tersedia",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        envPasswordHash
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }

      // Buat admin pertama kali ke MongoDB
      admin = await Admin.create({
        username: envUsername,
        password: envPasswordHash,
      });
    } else {
      // ==================================================
      // LOGIN DARI MONGODB
      // ==================================================
      const passwordMatch = await bcrypt.compare(
        password,
        admin.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }
    }

    // ==================================================
    // BUAT JWT
    // ==================================================
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Gagal melakukan login",
    });
  }
});

// ======================================================
// GANTI PASSWORD DARI HALAMAN LOGIN
// ======================================================
// TIDAK menggunakan authMiddleware
//
// User cukup memasukkan:
// - username
// - password lama
// - password baru
// - konfirmasi password baru
// ======================================================
router.put("/change-password-public", async (req, res) => {
  try {
    const {
      username,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // ==================================================
    // VALIDASI
    // ==================================================
    if (
      !username ||
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password baru minimal 8 karakter",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Konfirmasi password tidak cocok",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message:
          "Password baru harus berbeda dari password lama",
      });
    }

    // ==================================================
    // CARI ADMIN DI MONGODB
    // ==================================================
    let admin = await Admin.findOne({ username });

    // ==================================================
    // JIKA ADMIN BELUM ADA
    // CEK USERNAME + PASSWORD DARI .env
    // ==================================================
    if (!admin) {
      const envUsername = process.env.ADMIN_USERNAME;
      const envPasswordHash = process.env.ADMIN_PASSWORD;

      if (username !== envUsername) {
        return res.status(401).json({
          message: "Username atau password lama salah",
        });
      }

      if (!envPasswordHash) {
        return res.status(500).json({
          message:
            "Konfigurasi password admin di server belum tersedia",
        });
      }

      const oldPasswordMatch = await bcrypt.compare(
        oldPassword,
        envPasswordHash
      );

      if (!oldPasswordMatch) {
        return res.status(401).json({
          message: "Username atau password lama salah",
        });
      }

      // ==================================================
      // BUAT ADMIN DENGAN PASSWORD BARU
      // ==================================================
      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      admin = await Admin.create({
        username: envUsername,
        password: hashedPassword,
      });

      return res.json({
        message:
          "Password berhasil diubah. Silakan login menggunakan password baru.",
      });
    }

    // ==================================================
    // ADMIN SUDAH ADA
    // CEK PASSWORD LAMA
    // ==================================================
    const oldPasswordMatch = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!oldPasswordMatch) {
      return res.status(401).json({
        message: "Username atau password lama salah",
      });
    }

    // ==================================================
    // HASH PASSWORD BARU
    // ==================================================
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    return res.json({
      message:
        "Password berhasil diubah. Silakan login menggunakan password baru.",
    });
  } catch (error) {
    console.error(
      "CHANGE PASSWORD PUBLIC ERROR:",
      error
    );

    return res.status(500).json({
      message: "Gagal mengubah password",
    });
  }
});

// ======================================================
// GANTI PASSWORD DARI HALAMAN ADMIN
// ======================================================
// Endpoint ini tetap dipertahankan.
// Digunakan jika admin sudah login.
// ======================================================
router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      // ==================================================
      // VALIDASI
      // ==================================================
      if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return res.status(400).json({
          message: "Semua field password wajib diisi",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message:
            "Password baru minimal 8 karakter",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message:
            "Konfirmasi password tidak cocok",
        });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({
          message:
            "Password baru harus berbeda dari password lama",
        });
      }

      // ==================================================
      // CARI ADMIN
      // ==================================================
      const admin = await Admin.findById(
        req.admin.id
      );

      if (!admin) {
        return res.status(404).json({
          message: "Admin tidak ditemukan",
        });
      }

      // ==================================================
      // CEK PASSWORD LAMA
      // ==================================================
      const oldPasswordMatch =
        await bcrypt.compare(
          oldPassword,
          admin.password
        );

      if (!oldPasswordMatch) {
        return res.status(401).json({
          message: "Password lama salah",
        });
      }

      // ==================================================
      // HASH PASSWORD BARU
      // ==================================================
      const hashedPassword =
        await bcrypt.hash(newPassword, 10);

      admin.password = hashedPassword;

      await admin.save();

      return res.json({
        message:
          "Password berhasil diubah. Silakan login kembali.",
      });
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        message: "Gagal mengubah password",
      });
    }
  }
);

module.exports = router;