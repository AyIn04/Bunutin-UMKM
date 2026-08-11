import hero from "../assets/bangli.jpg";

export default function Hero() {
  return (
    <section className="relative h-[650px] overflow-hidden">

      {/* Background */}
      <img
        src={hero}
        alt="Desa Bunutin"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">

        <div className="flex justify-center gap-8 mb-8">

  <img
    src="/images/Logo-Desa.png"
    alt="Logo Desa Bunutin"
    className="w-24 h-24 object-contain"
  />

  <img
    src="/images/Logo-KKN-Bunutin-2026.png"
    alt="Logo KKN"
    className="w-24 h-24 object-contain"
  />

</div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Selamat Datang
        </h1>

        <p className="mt-5 text-xl md:text-2xl font-light max-w-3xl leading-relaxed">
          Website UMKM Desa Bunutin sebagai media promosi produk unggulan
          masyarakat serta sarana untuk mendukung pertumbuhan ekonomi desa.
        </p>

      </div>

    </section>
  );
}