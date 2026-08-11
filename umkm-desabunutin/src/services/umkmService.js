import { getToken } from "./authService";

const API_URL = "http://localhost:5000/api/umkm";

// =========================
// HEADER AUTH
// =========================
const authHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =========================
// GET SEMUA UMKM
// =========================
export const getUMKM = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data UMKM");
  }

  return await response.json();
};

// =========================
// GET UMKM BY ID
// =========================
export const getUMKMById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("UMKM tidak ditemukan");
  }

  return await response.json();
};

// =========================
// POST TAMBAH UMKM
// =========================
export const createUMKM = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Gagal menambahkan UMKM"
    );
  }

  return await response.json();
};

// =========================
// PUT EDIT UMKM
// =========================
export const updateUMKM = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Gagal memperbarui UMKM"
    );
  }

  return await response.json();
};

// =========================
// DELETE UMKM
// =========================
export const deleteUMKM = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Gagal menghapus UMKM"
    );
  }

  return await response.json();
};

// =========================
// UPLOAD GAMBAR + GALERI
// =========================
export const uploadImages = async (
  gambar,
  galeri = []
) => {
  const formData = new FormData();

  // Gambar utama
  if (gambar) {
    formData.append("gambar", gambar);
  }

  // Galeri
  galeri.forEach((file) => {
    formData.append("galeri", file);
  });

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",

    headers: {
      ...authHeaders(),
    },

    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Gagal mengupload gambar"
    );
  }

  return await response.json();
};