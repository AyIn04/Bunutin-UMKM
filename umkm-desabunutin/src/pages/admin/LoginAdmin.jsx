import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  loginAdmin,
  changePasswordPublic,
} from "../../services/authService";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await loginAdmin(username, password);

      const from =
        location.state?.from?.pathname ||
        "/admin/umkm";

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Username atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GANTI PASSWORD
  // =========================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError(
        "Password baru minimal 8 karakter."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    if (oldPassword === newPassword) {
      setError(
        "Password baru harus berbeda dari password lama."
      );
      return;
    }

    try {
      setLoading(true);

      await changePasswordPublic({
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setSuccess(
        "Password berhasil diubah. Silakan login menggunakan password baru."
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setMode("login");
        setPassword("");
        setSuccess("");
      }, 2000);
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

  // =========================
  // LOGIN
  // =========================

  if (mode === "login") {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#68002F]">
              Login Admin
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola data UMKM Desa Bunutin
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* USERNAME */}

            <div>
              <label className="block font-semibold mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                autoComplete="username"
                placeholder="Masukkan username"
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

            {/* PASSWORD */}

            <div>
              <label className="block font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                placeholder="Masukkan password"
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

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#68002F]
                hover:bg-[#520025]
                text-white
                py-3
                rounded-xl
                font-semibold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Memproses..."
                : "Login"}
            </button>

          </form>

          {/* GANTI PASSWORD */}

          <div className="text-center mt-6 pt-5 border-t">
            <button
              type="button"
              onClick={() => {
                setMode("change");
                setError("");
                setSuccess("");
                setPassword("");
              }}
              className="
                text-[#008B80]
                font-semibold
                hover:text-[#68002F]
                transition
              "
            >
              Ganti Password
            </button>
          </div>

        </div>
      </section>
    );
  }

  // =========================
  // GANTI PASSWORD
  // =========================

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#68002F]">
            Ganti Password
          </h1>

          <p className="text-gray-500 mt-2">
            Masukkan password lama untuk mengganti password.
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
            {success}
          </div>
        )}

        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >

          {/* USERNAME */}

          <div>
            <label className="block font-semibold mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              autoComplete="username"
              placeholder="Masukkan username"
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

          {/* PASSWORD LAMA */}

          <div>
            <label className="block font-semibold mb-2">
              Password Lama
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              required
              autoComplete="current-password"
              placeholder="Password lama"
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
            <label className="block font-semibold mb-2">
              Password Baru
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
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
            <label className="block font-semibold mb-2">
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

          {/* SIMPAN */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[#68002F]
              hover:bg-[#520025]
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Password"}
          </button>

        </form>

        {/* KEMBALI */}

        <div className="text-center mt-6 pt-5 border-t">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            className="
              text-[#008B80]
              font-semibold
              hover:text-[#68002F]
              transition
            "
          >
            ← Kembali ke Login
          </button>
        </div>

      </div>
    </section>
  );
}