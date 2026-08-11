import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  search,
  setSearch,
  kategori,
  setKategori,
}) {
  return (
    <section className="px-6 pb-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row gap-4">

          {/* Search */}
          <div className="relative flex-1">

            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#09807A]" />

            <input
              type="text"
              placeholder="Cari UMKM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                py-3
                pl-12
                pr-4
                text-gray-700
                focus:outline-none
                focus:border-[#09807A]
                focus:ring-2
                focus:ring-[#09807A]/20
                transition
              "
            />

          </div>

          {/* Filter */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="
              md:w-64
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-gray-700
              bg-white
              focus:outline-none
              focus:border-[#09807A]
              focus:ring-2
              focus:ring-[#09807A]/20
              transition
            "
          >
            <option value="Semua">Semua Kategori</option>

            <option value="Kuliner">
              Kuliner
            </option>

            <option value="Kuliner Tradisional">
              Kuliner Tradisional
            </option>

            <option value="Kerajinan">
              Kerajinan
            </option>

            <option value="Pertanian">
              Pertanian
            </option>

          </select>

        </div>

      </div>
    </section>
  );
}