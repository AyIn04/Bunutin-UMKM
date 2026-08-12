const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const umkmRoutes = require("./routes/umkmRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// =========================
// CORS
// =========================

const allowedOrigins = [
  "https://bunutin-umkm-hc9y-rosy.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.options("*", cors());

// =========================
// JSON
// =========================

app.use(express.json());

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Backend UMKM Desa Bunutin berjalan",
  });
});

// =========================
// ROUTES
// =========================

app.use("/api/umkm", umkmRoutes);
app.use("/api/auth", authRoutes);

// =========================
// DATABASE
// =========================

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  isConnected = true;

  console.log("MongoDB berhasil terhubung");
}

// =========================
// VERCEL HANDLER
// =========================

module.exports = async (req, res) => {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error(
      "Database connection error:",
      error
    );

    return res.status(500).json({
      message: "Gagal terhubung ke database",
    });
  }
};