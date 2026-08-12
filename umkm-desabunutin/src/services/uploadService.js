const API_URL = "https://bunutin-umkm.vercel.app/api/umkm/upload";

export async function uploadImages(gambar, galeri = []) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error(
      "Token login tidak ditemukan. Silakan login kembali."
    );
  }

  const formData = new FormData();

  if (gambar) {
    formData.append("gambar", gambar);
  }

  galeri.forEach((file) => {
    formData.append("galeri", file);
  });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal upload gambar"
    );
  }

  return result;
}