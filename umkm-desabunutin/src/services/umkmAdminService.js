const API_URL = "http://localhost:5000/api/umkm";

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
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("UMKM tidak ditemukan");
  }

  return await response.json();
}

// =========================
// POST tambah UMKM
// =========================
export async function createUMKM(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
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
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menghapus UMKM"
    );
  }

  return result;
}