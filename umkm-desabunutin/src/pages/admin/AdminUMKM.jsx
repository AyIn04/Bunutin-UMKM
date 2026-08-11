import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  getAllUMKM,
  deleteUMKM,
} from "../../services/umkmAdminService";

import { logoutAdmin } from "../../services/authService";

export default function AdminUMKM() {
  const [umkm, setUmkm] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logoutAdmin();

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =========================
  // GET DATA
  // =========================
  const fetchData = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getAllUMKM();

    setUmkm(data);
  } catch (err) {
    console.error(err);

    setError(
      err.message || "Gagal mengambil data UMKM"
    );
  } finally {
    setLoading(false);
  }
};
  // =========================
  // LOAD PERTAMA
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id, nama) => {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus "${nama}"?\n\nData yang sudah dihapus tidak dapat dikembalikan.`
    );

    if (!yakin) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

await deleteUMKM(id);

await fetchData();

      setSuccess(
        `UMKM "${nama}" berhasil dihapus.`
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Gagal menghapus UMKM"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // LOADING AWAL
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              animate-spin
              rounded-full
              h-10
              w-10
              border-b-2
              border-[#008B80]
              mx-auto
              mb-4
            "
          ></div>

          <p className="text-gray-600">
            Memuat data UMKM...
          </p>

        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-8
          "
        >

          {/* JUDUL */}
          <div>
            <h1 className="text-3xl font-bold text-[#68002F]">
              Kelola UMKM
            </h1>

            <p className="text-gray-600 mt-1">
              Kelola data UMKM Desa Bunutin
            </p>
          </div>

          {/* BUTTON */}
          <div className="flex flex-wrap items-center gap-3">

            {/* TAMBAH */}
            <Link
              to="/admin/umkm/tambah"
              className="
                inline-flex
                items-center
                gap-2
                bg-[#008B80]
                hover:bg-[#68002F]
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              <FaPlus />
              Tambah UMKM
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                inline-flex
                items-center
                gap-2
                bg-[#68002F]
                hover:bg-[#520025]
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        </div>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div
            className="
              bg-red-50
              border
              border-red-200
              text-red-700
              px-5
              py-4
              rounded-xl
              mb-6
            "
          >
            <p className="font-semibold">
              Terjadi kesalahan
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            SUCCESS
        ========================= */}
        {success && (
          <div
            className="
              bg-green-50
              border
              border-green-200
              text-green-700
              px-5
              py-4
              rounded-xl
              mb-6
            "
          >
            {success}
          </div>
        )}

        {/* =========================
            TABLE
        ========================= */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">

            <table className="w-full">

              {/* HEADER TABLE */}
              <thead
                className="
                  bg-[#68002F]
                  text-white
                "
              >
                <tr>

                  <th className="px-6 py-4 text-left">
                    UMKM
                  </th>

                  <th className="px-6 py-4 text-left">
                    Kategori
                  </th>

                  <th className="px-6 py-4 text-left">
                    Pemilik
                  </th>

                  <th className="px-6 py-4 text-center">
                    Aksi
                  </th>

                </tr>
              </thead>

              {/* BODY TABLE */}
              <tbody>

                {umkm.map((item) => (
                  <tr
                    key={item._id}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >

                    {/* UMKM */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        {item.gambar ? (
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="
                              w-16
                              h-16
                              object-cover
                              rounded-xl
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-16
                              h-16
                              bg-gray-200
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              text-xs
                              text-gray-500
                            "
                          >
                            No Image
                          </div>
                        )}

                        <div>

                          <p
                            className="
                              font-semibold
                              text-gray-900
                            "
                          >
                            {item.nama}
                          </p>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {item.alamat || "-"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* KATEGORI */}
                    <td className="px-6 py-4">

                      <span
                        className="
                          bg-[#DDF3F0]
                          text-[#008B80]
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "
                      >
                        {item.kategori}
                      </span>

                    </td>

                    {/* PEMILIK */}
                    <td
                      className="
                        px-6
                        py-4
                        text-gray-700
                      "
                    >
                      {item.pemilik || "-"}
                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-4">

                      <div
                        className="
                          flex
                          justify-center
                          gap-3
                        "
                      >

                        {/* EDIT */}
                        <Link
                          to={`/admin/umkm/edit/${item._id}`}
                          className="
                            p-3
                            rounded-lg
                            bg-blue-100
                            text-blue-700
                            hover:bg-blue-200
                          "
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item._id,
                              item.nama
                            )
                          }
                          disabled={
                            deletingId !== null
                          }
                          className="
                            p-3
                            rounded-lg
                            bg-red-100
                            text-red-700
                            hover:bg-red-200
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                          title="Hapus"
                        >
                          {deletingId === item._id ? (
                            <span
                              className="
                                inline-block
                                animate-spin
                                h-4
                                w-4
                                border-2
                                border-red-700
                                border-t-transparent
                                rounded-full
                              "
                            />
                          ) : (
                            <FaTrash />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {/* =========================
              EMPTY STATE
          ========================= */}
          {umkm.length === 0 && (
            <div
              className="
                text-center
                py-16
                text-gray-500
              "
            >
              <p className="text-lg font-medium">
                Belum ada data UMKM.
              </p>

              <p className="text-sm mt-1">
                Silakan tambahkan UMKM baru.
              </p>

              <Link
                to="/admin/umkm/tambah"
                className="
                  inline-block
                  mt-5
                  bg-[#008B80]
                  hover:bg-[#68002F]
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                "
              >
                Tambah UMKM
              </Link>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}