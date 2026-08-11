import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

// =========================
// COMPONENTS
// =========================

import Hero from "./components/Hero";
import Intro from "./components/Intro";
import SectionTitle from "./components/SectionTitle";
import SearchBar from "./components/SearchBar";
import UMKMGrid from "./components/UMKMGrid";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// PAGES
// =========================

import DetailUMKM from "./pages/DetailUMKM";

import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminUMKM from "./pages/admin/AdminUMKM";
import TambahUMKM from "./pages/admin/TambahUMKM";
import EditUMKM from "./pages/admin/EditUMKM";
//import GantiPassword from "./pages/admin/GantiPassword";

// =========================
// SCROLL TO TOP
// =========================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// =========================
// HOME
// =========================

function Home() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  return (
    <>
      <Hero />

      <Intro />

      <SectionTitle />

      <SearchBar
        search={search}
        setSearch={setSearch}
        kategori={kategori}
        setKategori={setKategori}
      />

      <UMKMGrid
        search={search}
        kategori={kategori}
      />

      <Footer />
    </>
  );
}

// =========================
// APP
// =========================

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* =========================
            WEBSITE PUBLIK
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/umkm/:id"
          element={<DetailUMKM />}
        />

        {/* =========================
            LOGIN ADMIN
        ========================= */}

        <Route
          path="/admin/login"
          element={<LoginAdmin />}
        />

        {/* =========================
            ADMIN TERPROTEKSI
        ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* Kelola UMKM */}
          <Route
            path="/admin/umkm"
            element={<AdminUMKM />}
          />

          {/* Tambah UMKM */}
          <Route
            path="/admin/umkm/tambah"
            element={<TambahUMKM />}
          />

          {/* Edit UMKM */}
          <Route
            path="/admin/umkm/edit/:id"
            element={<EditUMKM />}
          />

          //{/* Ganti Password */}
          //<Route
            //path="/admin/ganti-password"
            //element={<GantiPassword />}
          />

        </Route>

        {/* =========================
            404
        ========================= */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-[#68002F]">
                  404
                </h1>

                <p className="text-gray-500 mt-2">
                  Halaman tidak ditemukan.
                </p>
              </div>
            </div>
          }
        />

      </Routes>
    </>
  );
}