import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import { createUMKM } from "../../services/umkmService";
import { uploadImages } from "../../services/uploadService";

export default function TambahUMKM() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    deskripsiSingkat: "",
    deskripsi: "",
    alamat: "",
    maps: "",
    whatsapp: "",
    pemilik: "",
    jamOperasional: "",
  });

  const [gambar, setGambar] = useState(null);
  const [galeri, setGaleri] = useState([]);

  const [previewGambar, setPreviewGambar] = useState("");
  const [previewGaleri, setPreviewGaleri] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [kategoriLainnya, setKategoriLainnya] = useState("");

  // =========================
  // HANDLE FORM
  // =========================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // GAMBAR UTAMA
  // =========================
  const handleGambar = (e) => {
    const file = e.target.files[0];

    // Tidak ada file
    if (!file) {
      setGambar(null);
      setPreviewGambar("");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File gambar utama harus berupa gambar.");
      setGambar(null);
      setPreviewGambar("");
      e.target.value = "";
      return;
    }

    // Maksimal 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran gambar utama maksimal 10 MB.");
      setGambar(null);
      setPreviewGambar("");
      e.target.value = "";
      return;
    }

    // File valid
    setError("");
    setGambar(file);

    // Bersihkan preview sebelumnya
    if (previewGambar) {
      URL.revokeObjectURL(previewGambar);
    }

    setPreviewGambar(URL.createObjectURL(file));
  };

  // =========================
  // GALERI
  // =========================
  const handleGaleri = (e) => {
    const files = Array.from(e.target.files);

    // Maksimal 10 foto
    if (files.length > 10) {
      setError(
        "Maksimal 10 foto galeri yang dapat dipilih."
      );

      setGaleri([]);
      setPreviewGaleri([]);

      e.target.value = "";
      return;
    }

    // Validasi setiap file
    for (const file of files) {
      // Validasi tipe
      if (!file.type.startsWith("image/")) {
        setError(
          "Semua file galeri harus berupa gambar."
        );

        setGaleri([]);
        setPreviewGaleri([]);

        e.target.value = "";
        return;
      }

      // Maksimal 10 MB
      if (file.size > 10 * 1024 * 1024) {
        setError(
          `Ukuran file "${file.name}" maksimal 10 MB.`
        );

        setGaleri([]);
        setPreviewGaleri([]);

        e.target.value = "";
        return;
      }
    }

    // File valid
    setError("");
    setGaleri(files);

    // Bersihkan preview lama
    previewGaleri.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewGaleri(previews);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // =========================
      // 1. UPLOAD GAMBAR
      // =========================
      let gambarUrl = "";
      let galeriUrl = [];

      if (gambar || galeri.length > 0) {
        const uploadResult = await uploadImages(
          gambar,
          galeri
        );

        gambarUrl = uploadResult.gambar || "";
        galeriUrl = uploadResult.galeri || [];
      }

      // =========================
      // 2. SIMPAN KE MONGODB
      // =========================
const kategoriFinal =
  form.kategori === "Lainnya"
    ? kategoriLainnya.trim()
    : form.kategori;

if (!kategoriFinal) {
  setError("Kategori wajib diisi.");
  return;
}

await createUMKM({
  ...form,
  kategori: kategoriFinal,
  gambar: gambarUrl,
  galeri: galeriUrl,
});

      // =========================
      // 3. KEMBALI KE LIST
      // =========================
      navigate("/admin/umkm");
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Gagal menambahkan UMKM"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STYLE INPUT FILE
  // =========================
  const fileInputClass = `
    w-full
    border
    border-gray-300
    rounded-xl
    px-4
    py-3
    bg-gray-50
    text-gray-600
    file:mr-4
    file:py-2
    file:px-4
    file:rounded-lg
    file:border-0
    file:bg-[#DDF3F0]
    file:text-[#008B80]
    file:font-semibold
    hover:file:bg-[#c9ebe6]
    cursor-pointer
  `;

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">

      {/* =========================
          KEMBALI
      ========================= */}
      <button
        onClick={() => navigate("/admin/umkm")}
        className="
          flex
          items-center
          gap-2
          text-[#008B80]
          font-semibold
          hover:text-[#68002F]
          transition
          mb-8
        "
      >
        <FaArrowLeft />
        Kembali ke Kelola UMKM
      </button>

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#68002F]">
          Tambah UMKM
        </h1>

        <p className="text-gray-500 mt-2">
          Tambahkan data UMKM Desa Bunutin
        </p>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="
          mb-6
          bg-red-50
          border
          border-red-200
          text-red-700
          rounded-xl
          p-4
        ">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          p-8
          space-y-8
        "
      >

        {/* =========================
            INFORMASI DASAR
        ========================= */}
        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Informasi UMKM
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Nama */}
            <div>
              <label className="block font-semibold mb-2">
                Nama UMKM *
              </label>

              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#008B80]
                "
                placeholder="Contoh: Pratama Batik"
              />
            </div>

            {/* Kategori */}
            <div>
  <label className="block font-semibold mb-2">
    Kategori *
  </label>

  <select
    name="kategori"
    value={form.kategori}
    onChange={(e) => {
      setForm({
        ...form,
        kategori: e.target.value,
      });

      if (e.target.value !== "Lainnya") {
        setKategoriLainnya("");
      }
    }}
    required
    className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#008B80]"
  >
    <option value="">Pilih kategori</option>
    <option value="Kuliner">Kuliner</option>
    <option value="Kuliner Tradisional">Kuliner Tradisional</option>
    <option value="Kerajinan">Kerajinan</option>
    <option value="Pertanian">Pertanian</option>
    <option value="Perdagangan">Perdagangan</option>
    <option value="Lainnya">Lainnya</option>
  </select>

  {form.kategori === "Lainnya" && (
    <input
      type="text"
      value={kategoriLainnya}
      onChange={(e) => setKategoriLainnya(e.target.value)}
      required
      placeholder="Masukkan kategori baru"
      className="w-full border rounded-xl px-4 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-[#008B80]"
    />
  )}
</div>
          </div>
        </div>

        {/* =========================
            DESKRIPSI
        ========================= */}
        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Deskripsi
          </h2>

          <div className="space-y-5">

            {/* Deskripsi Singkat */}
            <div>
              <label className="block font-semibold mb-2">
                Deskripsi Singkat
              </label>

              <textarea
                name="deskripsiSingkat"
                value={form.deskripsiSingkat}
                onChange={handleChange}
                rows="3"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#008B80]
                "
                placeholder="Deskripsi singkat UMKM..."
              />
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label className="block font-semibold mb-2">
                Deskripsi Lengkap
              </label>

              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                rows="8"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#008B80]
                "
                placeholder="Tuliskan deskripsi lengkap UMKM..."
              />
            </div>

          </div>
        </div>

        {/* =========================
            FOTO
        ========================= */}
        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Foto UMKM
          </h2>

          <div className="space-y-5">

            {/* GAMBAR UTAMA */}
            <div>
              <label className="block font-semibold mb-2">
                Gambar Utama
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleGambar}
                className={fileInputClass}
              />

              {previewGambar && (
                <div className="mt-4">

                  <p className="text-sm font-semibold mb-2">
                    Preview Gambar Utama
                  </p>

                  <img
                    src={previewGambar}
                    alt="Preview gambar utama"
                    className="
                      w-48
                      h-36
                      object-cover
                      rounded-xl
                      border
                    "
                  />

                </div>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Maksimal 10 MB.
              </p>
            </div>

            {/* GALERI */}
            <div>
              <label className="block font-semibold mb-2">
                Galeri Foto
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleri}
                className={fileInputClass}
              />

              {previewGaleri.length > 0 && (
                <div className="mt-4">

                  <p className="text-sm font-semibold mb-3">
                    Preview Galeri ({previewGaleri.length}/10)
                  </p>

                  <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-5
                    gap-3
                  ">
                    {previewGaleri.map(
                      (preview, index) => (
                        <div
                          key={index}
                          className="relative"
                        >

                          <img
                            src={preview}
                            alt={`Preview galeri ${index + 1}`}
                            className="
                              w-full
                              aspect-square
                              object-cover
                              rounded-xl
                              border
                            "
                          />

                          <span className="
                            absolute
                            bottom-2
                            left-2
                            bg-black/60
                            text-white
                            text-xs
                            px-2
                            py-1
                            rounded-full
                          ">
                            {index + 1}
                          </span>

                        </div>
                      )
                    )}
                  </div>

                </div>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Maksimal 10 foto, masing-masing maksimal 10 MB.
              </p>
            </div>

          </div>
        </div>

        {/* =========================
            KONTAK
        ========================= */}
        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Informasi Kontak
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Pemilik */}
            <div>
              <label className="block font-semibold mb-2">
                Pemilik
              </label>

              <input
                type="text"
                name="pemilik"
                value={form.pemilik}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block font-semibold mb-2">
                WhatsApp
              </label>

              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setForm((prev) => ({
                    ...prev,
                    whatsapp: value,
                  }));
                }}
                inputMode="numeric"
                placeholder="085..."
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#008B80]
                "
              />

              <p className="text-sm text-gray-500 mt-2">
                Masukkan nomor WhatsApp menggunakan angka saja.
              </p>
            </div>

            {/* Jam Operasional */}
            <div>
              <label className="block font-semibold mb-2">
                Jam Operasional
              </label>

              <input
                type="text"
                name="jamOperasional"
                value={form.jamOperasional}
                onChange={handleChange}
                placeholder="08.00 - 17.00"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>

          </div>
        </div>

        {/* =========================
            ALAMAT
        ========================= */}
        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Lokasi
          </h2>

          <div className="space-y-5">

            {/* Alamat */}
            <div>
              <label className="block font-semibold mb-2">
                Alamat
              </label>

              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                rows="3"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>

            {/* Maps */}
            <div>
              <label className="block font-semibold mb-2">
                Link Google Maps
              </label>

              <input
                type="url"
                name="maps"
                value={form.maps}
                onChange={handleChange}
                placeholder="https://maps.app.goo.gl/..."
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>

          </div>
        </div>

        {/* =========================
            BUTTON
        ========================= */}
        <div className="
          flex
          justify-end
          gap-4
          pt-5
          border-t
        ">

          <button
            type="button"
            onClick={() => navigate("/admin/umkm")}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              border
              font-semibold
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-[#008B80]
              hover:bg-[#68002F]
              text-white
              font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <FaSave />

            {loading
              ? "Menyimpan..."
              : "Simpan UMKM"}
          </button>

        </div>

      </form>
    </section>
  );
}