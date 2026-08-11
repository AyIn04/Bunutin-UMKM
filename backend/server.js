const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const umkmRoutes = require("./routes/umkmRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend UMKM Desa Bunutin berjalan",
  });
});

app.use("/api/umkm", umkmRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB berhasil terhubung");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server berjalan di http://localhost:${
          process.env.PORT || 5000
        }`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Gagal terhubung ke MongoDB:",
      error.message
    );
  });