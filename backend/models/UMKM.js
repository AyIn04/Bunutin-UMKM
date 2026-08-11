const mongoose = require("mongoose");

const umkmSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },

    kategori: {
      type: String,
      required: true,
      trim: true,
    },

    gambar: {
      type: String,
      default: "",
    },

    galeri: {
      type: [String],
      default: [],
    },

    deskripsiSingkat: {
      type: String,
      default: "",
    },

    deskripsi: {
      type: String,
      default: "",
    },

    alamat: {
      type: String,
      default: "",
    },

    maps: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    pemilik: {
      type: String,
      default: "",
    },

    jamOperasional: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UMKM", umkmSchema);