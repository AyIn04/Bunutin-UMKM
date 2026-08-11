import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUser,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function DetailUMKM() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fotoAktif, setFotoAktif] = useState(0);

  // =========================
  // GET DETAIL UMKM
  // =========================
  useEffect(() => {
    const fetchUMKM = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/umkm/${id}`
        );

        if (!response.ok) {
          throw new Error("UMKM tidak ditemukan");
        }

        const result = await response.json();

        setData(result);

        // Reset foto aktif setiap kali data berubah
        setFotoAktif(0);
      } catch (err) {
        console.error(err);
        setError("UMKM tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    fetchUMKM();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Memuat data UMKM...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">
          UMKM Tidak Ditemukan
        </h2>

        <Link
          to="/"
          className="mt-5 text-[#008B80] font-semibold hover:text-[#68002F] transition"
        >
          ← Kembali ke Daftar UMKM
        </Link>
      </div>
    );
  }

  // =========================
  // FOTO
  // =========================

  // Gambar utama
  const gambarUtama =
    typeof data.gambar === "string"
      ? data.gambar.trim()
      : "";

  // Gallery
  const galeri =
    Array.isArray(data.galeri)
      ? data.galeri.filter(
          (foto) =>
            typeof foto === "string" &&
            foto.trim() !== ""
        )
      : [];

  // Gabungkan gambar utama + gallery
  const semuaFoto = [
    ...(gambarUtama ? [gambarUtama] : []),
    ...galeri,
  ];

  const fotoUtama = semuaFoto[fotoAktif] || "";

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      {/* =========================
          KEMBALI
      ========================= */}
      <Link
        to="/"
        className="inline-block mb-8 text-[#008B80] font-semibold hover:text-[#68002F] transition"
      >
        ← Kembali ke Daftar UMKM
      </Link>

      {/* =========================
          FOTO + IDENTITAS
      ========================= */}
      <div className="grid lg:grid-cols-5 gap-10">

        {/* =========================
            FOTO
        ========================= */}
        <div className="lg:col-span-3">

          {/* FOTO UTAMA */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100">

            {fotoUtama ? (
              <img
                src={fotoUtama}
                alt={data.nama}
                className="w-full aspect-[4/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400">
                Belum ada foto
              </div>
            )}

            {/* COUNTER FOTO */}
            {semuaFoto.length > 0 && (
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {fotoAktif + 1} / {semuaFoto.length}
              </div>
            )}

          </div>

          {/* =========================
              THUMBNAIL GALLERY
          ========================= */}
          {semuaFoto.length > 1 && (
            <div className="flex gap-3 mt-5 overflow-x-auto pb-2">

              {semuaFoto.map((foto, index) => (
                <button
                  key={`${foto}-${index}`}
                  type="button"
                  onClick={() => setFotoAktif(index)}
                  className={`flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                    fotoAktif === index
                      ? "border-[#008B80]"
                      : "border-transparent hover:border-[#68002F]"
                  }`}
                >
                  <img
                    src={foto}
                    alt={`${data.nama} ${index + 1}`}
                    className="w-24 h-24 object-cover hover:scale-110 transition"
                  />
                </button>
              ))}

            </div>
          )}

        </div>

        {/* =========================
            IDENTITAS
        ========================= */}
        <div className="lg:col-span-2">

          {/* KATEGORI */}
          {data.kategori && (
            <span className="inline-flex bg-[#DDF3F0] text-[#008B80] px-4 py-1 rounded-full text-sm font-medium">
              {data.kategori}
            </span>
          )}

          {/* NAMA */}
          <h1 className="text-4xl font-bold text-[#68002F] mt-4">
            {data.nama}
          </h1>

          {/* =========================
              INFORMASI
          ========================= */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 shadow-sm space-y-6">

            {/* ALAMAT */}
            {data.alamat && (
              <div className="flex gap-4">

                <FaMapMarkerAlt className="text-[#68002F] mt-1 text-xl" />

                <div>
                  <h4 className="font-semibold">
                    Alamat
                  </h4>

                  <p className="text-gray-600">
                    {data.alamat}
                  </p>

                  {data.maps && (
                    <a
                      href={data.maps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-[#008B80] hover:text-[#68002F] hover:underline transition"
                    >
                      Lihat di Google Maps
                      <FaExternalLinkAlt size={12} />
                    </a>
                  )}
                </div>

              </div>
            )}

            {/* WHATSAPP */}
            {data.whatsapp && (
              <div className="flex gap-4">

                <FaWhatsapp className="text-[#008B80] mt-1 text-xl" />

                <div>
                  <h4 className="font-semibold">
                    WhatsApp
                  </h4>

                  <p>
                    {data.whatsapp}
                  </p>
                </div>

              </div>
            )}

            {/* PEMILIK */}
            {data.pemilik && (
              <div className="flex gap-4">

                <FaUser className="text-[#008B80] mt-1 text-xl" />

                <div>
                  <h4 className="font-semibold">
                    Pemilik
                  </h4>

                  <p>
                    {data.pemilik}
                  </p>
                </div>

              </div>
            )}

            {/* JAM OPERASIONAL */}
            {data.jamOperasional && (
              <div className="flex gap-4">

                <FaClock className="text-[#68002F] mt-1 text-xl" />

                <div>
                  <h4 className="font-semibold">
                    Jam Operasional
                  </h4>

                  <p>
                    {data.jamOperasional}
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* =========================
              WHATSAPP BUTTON
          ========================= */}
          {data.whatsapp && (
            <a
              href={`https://wa.me/62${String(
                data.whatsapp
              ).replace(/^0/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="block mt-8"
            >
              <button
                type="button"
                className="w-full bg-[#008B80] hover:bg-[#68002F] text-white py-4 rounded-xl font-semibold transition"
              >
                Hubungi via WhatsApp
              </button>
            </a>
          )}

        </div>

      </div>

      {/* =========================
          DESKRIPSI
      ========================= */}
      {data.deskripsi && (
        <div className="mt-14">

          <h2 className="text-3xl font-bold text-[#68002F] mb-6">
            Deskripsi Lengkap
          </h2>

          <div className="bg-white border rounded-2xl shadow-sm p-8">

            <p className="leading-9 text-gray-700 text-justify">
              {data.deskripsi}
            </p>

          </div>

        </div>
      )}

    </section>
  );
}