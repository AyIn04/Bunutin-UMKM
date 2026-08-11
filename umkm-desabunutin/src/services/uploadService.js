export const uploadImages = async (
  gambar,
  galeri
) => {
  const formData = new FormData();

  if (gambar) {
    formData.append("gambar", gambar);
  }

  galeri.forEach((file) => {
    formData.append("galeri", file);
  });

  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    "http://localhost:5000/api/umkm/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal upload gambar"
    );
  }

  return result;
};