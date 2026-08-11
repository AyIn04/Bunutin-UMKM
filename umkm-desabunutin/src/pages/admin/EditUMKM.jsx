import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getUMKMById,
  updateUMKM,
} from "../../services/umkmAdminService";

import { uploadImages } from "../../services/uploadService";

export default function EditUMKM() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // FORM
  // =========================
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

  // =========================
  // GAMBAR LAMA
  // =========================
  const [gambarLama, setGambarLama] = useState("");
  const [galeriLama, setGaleriLama] = useState([]);

  // =========================
  // GAMBAR BARU
  // =========================
  const [gambarBaru, setGambarBaru] = useState(null);
  const [galeriBaru, setGaleriBaru] = useState([]);

  // =========================
  // PREVIEW
  // =========================
  const [previewGambar, setPreviewGambar] = useState("");
  const [previewGaleri, setPreviewGaleri] = useState([]);

  // =========================
  // STATUS
  // =========================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA UMKM
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getUMKMById(id);

        const data = result.data || result;

        // =========================
        // FORM
        // =========================
        setForm({
          nama: data.nama || "",
          kategori: data.kategori || "",
          deskripsiSingkat: data.deskripsiSingkat || "",
          deskripsi: data.deskripsi || "",
          alamat: data.alamat || "",
          maps: data.maps || "",
          whatsapp: data.whatsapp || "",
          pemilik: data.pemilik || "",
          jamOperasional: data.jamOperasional || "",
        });

        // =========================
        // GAMBAR LAMA
        // =========================
        setGambarLama(data.gambar || "");
        setGaleriLama(data.galeri || []);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Gagal mengambil data UMKM"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // HANDLE FORM
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE GAMBAR UTAMA
  // =========================
  const handleGambarBaru = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setGambarBaru(null);
      setPreviewGambar("");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("Gambar utama harus berupa file gambar.");
      e.target.value = "";
      return;
    }

    // Maksimal 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran gambar utama maksimal 10 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setGambarBaru(file);

    const previewUrl = URL.createObjectURL(file);
    setPreviewGambar(previewUrl);
  };

  // =========================
  // HANDLE GALERI BARU
  // =========================
  const handleGaleriBaru = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 10) {
      setError("Maksimal 10 foto galeri.");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Semua file galeri harus berupa gambar.");
        e.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(
          `Ukuran file "${file.name}" maksimal 10 MB.`
        );
        e.target.value = "";
        return;
      }
    }

    setError("");
    setGaleriBaru(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewGaleri(previewUrls);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      let gambarUrl = null;
      let galeriUrls = null;

      // =========================
      // 1. UPLOAD GAMBAR BARU
      // =========================
      if (gambarBaru || galeriBaru.length > 0) {
        const uploadResult = await uploadImages(
          gambarBaru,
          galeriBaru
        );

        // Hanya isi jika memang ada gambar utama baru
        if (gambarBaru) {
          gambarUrl = uploadResult.gambar || "";
        }

        // Hanya isi jika memang ada galeri baru
        if (galeriBaru.length > 0) {
          galeriUrls = uploadResult.galeri || [];
        }
      }

      // =========================
      // 2. SIAPKAN DATA UPDATE
      // =========================
      const dataUpdate = {
        ...form,
      };

      // Jika gambar utama baru dipilih
      if (gambarUrl) {
        dataUpdate.gambar = gambarUrl;
      }

      // Jika galeri baru dipilih
      if (galeriUrls !== null) {
        dataUpdate.galeri = galeriUrls;
      }

      // =========================
      // 3. UPDATE DATABASE
      // =========================
      await updateUMKM(id, dataUpdate);

      alert("UMKM berhasil diperbarui");

      navigate("/admin/umkm");
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Gagal memperbarui UMKM"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Memuat data UMKM...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR LOAD DATA
  // =========================
  if (error && !form.nama) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#68002F]">
          Gagal Memuat UMKM
        </h2>

        <p className="mt-3 text-gray-600">
          {error}
        </p>

        <Link
          to="/admin/umkm"
          className="mt-5 text-[#008B80] font-semibold hover:underline"
        >
          ← Kembali ke Kelola UMKM
        </Link>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">

      {/* Kembali */}
      <Link
        to="/admin/umkm"
        className="inline-block mb-8 text-[#008B80] font-semibold hover:text-[#68002F]"
      >
        ← Kembali ke Kelola UMKM
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#68002F]">
          Edit UMKM
        </h1>

        <p className="text-gray-500 mt-2">
          Perbarui informasi UMKM Desa Bunutin
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-8 space-y-8"
      >

        {/* =========================
            INFORMASI DASAR
        ========================= */}

        <div>
          <h2 className="text-xl font-bold text-[#68002F] mb-5">
            Informasi UMKM
          </h2>

          <div className="space-y-5">

            {/* Nama UMKM */}
<div>
  <label className="block font-semibold mb-2">
    Nama UMKM
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
      border-gray-300
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
                Kategori
              </label>

              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#008B80]"
              >
                <option value="">
                  Pilih kategori
                </option>

                <option value="Kerajinan">
                  Kerajinan
                </option>

                <option value="Kuliner">
                  Kuliner
                </option>

                <option value="Kuliner Tradisional">
                  Kuliner Tradisional
                </option>

                <option value="Pertanian">
                  Pertanian
                </option>

                <option value="Jasa">
                  Jasa
                </option>

                <option value="Perdagangan">
                  Perdagangan
                </option>

                <option value="Lainnya">
                  Lainnya
                </option>
              </select>
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
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008B80]"
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
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008B80]"
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

          <div className="space-y-8">

            {/* =========================
                GAMBAR UTAMA
            ========================= */}

            <div>
              <label className="block font-semibold mb-2">
                Gambar Utama
              </label>

              {/* Gambar lama */}
              {gambarLama && !gambarBaru && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Gambar saat ini
                  </p>

                  <img
                    src={gambarLama}
                    alt="Gambar utama"
                    className="w-64 h-44 object-cover rounded-xl border"
                  />
                </div>
              )}

              {/* Gambar baru */}
              {previewGambar && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Preview gambar baru
                  </p>

                  <img
                    src={previewGambar}
                    alt="Preview gambar baru"
                    className="w-64 h-44 object-cover rounded-xl border"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleGambarBaru}
                className="w-full border rounded-xl px-4 py-3"
              />

              <p className="text-sm text-gray-500 mt-2">
                Kosongkan jika tidak ingin mengganti gambar.
                Maksimal 10 MB.
              </p>

              {gambarBaru && (
                <p className="mt-2 text-sm text-[#008B80]">
                  File baru: {gambarBaru.name}
                </p>
              )}
            </div>

            {/* =========================
                GALERI
            ========================= */}

            <div>
              <label className="block font-semibold mb-2">
                Foto Galeri
              </label>

              {/* Galeri lama */}
              {galeriLama.length > 0 && galeriBaru.length === 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-500 mb-3">
                    Galeri saat ini
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {galeriLama.map((foto, index) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden border"
                      >
                        <img
                          src={foto}
                          alt={`Galeri lama ${index + 1}`}
                          className="w-full h-28 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Galeri baru */}
              {previewGaleri.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-500 mb-3">
                    Preview galeri baru
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {previewGaleri.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden border"
                      >
                        <img
                          src={preview}
                          alt={`Galeri baru ${index + 1}`}
                          className="w-full h-28 object-cover"
                        />

                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleriBaru}
                className="w-full border rounded-xl px-4 py-3"
              />

              <p className="text-sm text-gray-500 mt-2">
                Kosongkan jika tidak ingin mengganti galeri.
                Maksimal 10 foto, masing-masing maksimal 10 MB.
              </p>

              {galeriBaru.length > 0 && (
                <p className="mt-2 text-sm text-[#008B80]">
                  {galeriBaru.length} foto baru dipilih.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* =========================
            LOKASI
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
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* Maps */}
            <div>
              <label className="block font-semibold mb-2">
                Google Maps
              </label>

              <input
                type="url"
                name="maps"
                value={form.maps}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
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

            {/* WhatsApp */}
            <div>
              <label className="block font-semibold mb-2">
                WhatsApp
              </label>

              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

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
                className="w-full border rounded-xl px-4 py-3"
              />
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
                placeholder="Contoh: 08.00 - 17.00"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

          </div>
        </div>

        {/* =========================
            BUTTON
        ========================= */}

        <div className="flex gap-4 pt-4 border-t">

          <Link
            to="/admin/umkm"
            className="flex-1 text-center border border-gray-300 rounded-xl py-3 font-semibold text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#008B80] hover:bg-[#68002F] text-white rounded-xl py-3 font-semibold transition disabled:opacity-50"
          >
            {saving
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>

        </div>

      </form>
    </section>
  );
}