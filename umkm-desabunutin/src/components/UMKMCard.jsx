import { Link } from "react-router-dom";

export default function UMKMCard({
  id,
  nama,
  kategori,
  gambar,
  deskripsiSingkat,
}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">

      {/* Gambar */}
      <div className="relative h-60 overflow-hidden">

        <img
          src={gambar}
          alt={nama}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      </div>

      {/* Isi */}
      <div className="p-5 flex flex-col flex-1">

        {/* Kategori */}
        <span className="inline-flex self-start bg-burgundy-light text-burgundy px-3 py-1 rounded-full text-sm font-medium">
          {kategori}
        </span>

        {/* Nama */}
        <h3 className="text-2xl font-bold text-gray-900 mt-4">
          {nama}
        </h3>

        {/* Garis aksen */}
        <div className="w-12 h-1 bg-burgundy rounded-full mt-3 mb-4" />

        {/* Deskripsi */}
        <p className="text-gray-600 leading-7 h-[88px] overflow-hidden">
          {deskripsiSingkat}
        </p>

        {/* Tombol */}
        <Link
          to={`/umkm/${id}`}
          className="mt-auto pt-5 block"
        >
          <button
            className="
              w-full
              bg-[#68002F]
              hover:bg-[#008B80]  
              text-white
              py-3
              rounded-xl
              font-medium
              transition
            "
          >
            Lihat Detail
          </button>
        </Link>

      </div>
    </div>
  );
}