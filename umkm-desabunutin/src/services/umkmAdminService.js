import { getToken } from "./authService";

const API_URL = "https://bunutin-umkm.vercel.app/api/umkm";

// =========================
// HEADER AUTH
// =========================
function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

// =========================
// GET semua UMKM
// =========================
export async function getAllUMKM() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data UMKM");
  }

  return await response.json();
}

// =========================
// GET UMKM berdasarkan ID
// =========================
export async function getUMKMById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "UMKM tidak ditemukan"
    );
  }

  return result;
}

// =========================
// POST tambah UMKM
// =========================
export async function createUMKM(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menambahkan UMKM"
    );
  }

  return result;
}

// =========================
// PUT edit UMKM
// =========================
export async function updateUMKM(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memperbarui UMKM"
    );
  }

  return result;
}

// =========================
// DELETE UMKM
// =========================
export async function deleteUMKM(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menghapus UMKM"
    );
  }

  return result;
}