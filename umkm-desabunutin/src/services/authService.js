const API_URL = "https://bunutin-umkm.vercel.app/api/auth";

// =========================
// TOKEN
// =========================

export const getToken = () => {
  return localStorage.getItem("adminToken");
};

export const setToken = (token) => {
  localStorage.setItem("adminToken", token);
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};

export const isLoggedIn = () => {
  return !!getToken();
};

// =========================
// ALIAS
// =========================

export const logoutAdmin = () => {
  logout();
};

export const isAdminLoggedIn = () => {
  return isLoggedIn();
};

// =========================
// LOGIN ADMIN
// =========================

export const loginAdmin = async (
  username,
  password
) => {
  if (!username || !password) {
    throw new Error(
      "Username dan password wajib diisi"
    );
  }

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Username atau password salah"
    );
  }

  if (!result.token) {
    throw new Error(
      "Token login tidak diterima dari server"
    );
  }

  // Simpan JWT
  setToken(result.token);

  return result;
};

// =========================
// GANTI PASSWORD DARI LOGIN
// =========================

export const changePasswordPublic = async ({
  username,
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const response = await fetch(
    `${API_URL}/change-password-public`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    }
  );

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengubah password"
    );
  }

  return result;
};