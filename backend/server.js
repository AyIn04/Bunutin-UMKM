const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const umkmRoutes = require("./routes/umkmRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend UMKM Desa Bunutin berjalan",
  });
});

app.use("/api/umkm", umkmRoutes);
app.use("/api/auth", authRoutes);

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  isConnected = true;

  console.log("MongoDB berhasil terhubung");
}

module.exports = async (req, res) => {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      message: "Gagal terhubung ke database",
    });
  }
};