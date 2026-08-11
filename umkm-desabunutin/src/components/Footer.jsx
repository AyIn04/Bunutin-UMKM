import {
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#68002F] text-white mt-20">

      {/* Konten Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-5 gap-16">

          {/* Kiri */}
          <div className="lg:col-span-3">

            <h2 className="text-3xl font-bold mb-6">
              Website UMKM Desa Bunutin
            </h2>

            <p className="text-white/80 leading-9 text-lg">
              Website ini merupakan media informasi dan promosi berbagai
              produk unggulan UMKM Desa Bunutin sebagai bentuk dukungan
              terhadap pengembangan ekonomi masyarakat desa serta sarana
              untuk memperkenalkan potensi lokal kepada masyarakat luas.
            </p>

          </div>

          {/* Kanan */}
          <div className="lg:col-span-2">

            <h3 className="text-2xl font-semibold mb-8">
              Pemerintah Desa Bunutin
            </h3>

            {/* Alamat */}
            <div className="flex items-start gap-4 mb-8">

              <FaMapMarkerAlt
                className="text-xl mt-1 text-white flex-shrink-0"
              />

              <div>

                <p className="font-semibold mb-1">
                  Alamat
                </p>

                <p className="text-white/80 leading-8">
                  Jln. Dr. Ir. Soekarno, Desa Bunutin,
                  Kecamatan Bangli, Kabupaten Bangli,
                  Provinsi Bali 80614
                </p>

              </div>

            </div>

            {/* Email */}
            <div className="flex items-start gap-4">

              <FaEnvelope
                className="text-xl mt-1 text-white flex-shrink-0"
              />

              <div>

                <p className="font-semibold mb-1">
                  Email
                </p>

                <a
                  href="mailto:pemdes@bunutin.desa.id"
                  className="text-white/80 hover:text-white transition"
                >
                  pemdes@bunutin.desa.id
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/20">

        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-white/70 text-sm">
          KKN PPM Desa Bunutin Universitas Udayana Tahun 2026
        </div>

      </div>

    </footer>
  );
}