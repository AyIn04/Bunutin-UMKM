import { useEffect, useState } from "react";

import UMKMCard from "./UMKMCard";
import { getUMKM } from "../services/umkmService";

export default function UMKMGrid({ search, kategori }) {
  const [umkm, setUmkm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUMKM = async () => {
      try {
        const data = await getUMKM();
        setUmkm(data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data UMKM.");
      } finally {
        setLoading(false);
      }
    };

    fetchUMKM();
  }, []);

  const filteredUMKM = umkm.filter((item) => {
    const cocokNama = item.nama
      .toLowerCase()
      .includes(search.toLowerCase());

    const cocokKategori =
      kategori === "Semua" ||
      item.kategori === kategori;

    return cocokNama && cocokKategori;
  });

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center py-16 text-gray-500">
          Memuat data UMKM...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center py-16 text-red-500">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">

        {filteredUMKM.length > 0 ? (
          filteredUMKM.map((item) => (
            <UMKMCard
              key={item._id}
              {...item}
              id={item._id}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">
              UMKM tidak ditemukan
            </h3>

            <p className="text-gray-500 mt-2">
              Coba gunakan kata kunci atau kategori lain.
            </p>
          </div>
        )}

      </div>

    </section>
  );
}