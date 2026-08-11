import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";

import {
  changePassword,
  logout,
} from "../../services/authService";

export default function GantiPassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "Password baru minimal 8 karakter."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    if (
      oldPassword === newPassword
    ) {
      setError(
        "Password baru harus berbeda dari password lama."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setSuccess(
        "Password berhasil diubah. Anda akan diarahkan ke halaman login..."
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        logout();

        navigate("/admin/login", {
          replace: true,
        });
      }, 1500);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Gagal mengubah password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-xl mx-auto">

        {/* KEMBALI */}

        <button
          type="button"
          onClick={() =>
            navigate("/admin/umkm")
          }
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

        {/* CARD */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-8
          "
        >

          <h1
            className="
              text-3xl
              font-bold
              text-[#68002F]
            "
          >
            Ganti Password
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Ubah password akun administrator.
          </p>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                bg-red-50
                border
                border-red-200
                text-red-700
                rounded-xl
                p-4
              "
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              className="
                mb-6
                bg-green-50
                border
                border-green-200
                text-green-700
                rounded-xl
                p-4
              "
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* PASSWORD LAMA */}

            <div>
              <label
                className="
                  block
                  font-semibold
                  mb-2
                "
              >
                Password Lama
              </label>

              <input
                type="password"
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword(
                    e.target.value
                  )
                }
                required
                autoComplete="current-password"
                placeholder="Masukkan password lama"
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
            </div>

            {/* PASSWORD BARU */}

            <div>
              <label
                className="
                  block
                  font-semibold
                  mb-2
                "
              >
                Password Baru
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
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
            </div>

            {/* KONFIRMASI */}

            <div>
              <label
                className="
                  block
                  font-semibold
                  mb-2
                "
              >
                Konfirmasi Password Baru
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Ulangi password baru"
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
            </div>

            {/* BUTTON */}

            <div
              className="
                flex
                justify-end
                gap-3
                pt-5
                border-t
              "
            >

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/umkm")
                }
                disabled={loading}
                className="
                  px-5
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
                  inline-flex
                  items-center
                  gap-2
                  px-5
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
                  : "Simpan Password"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}