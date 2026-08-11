import { Link } from "react-router-dom";

function Hero() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  return (
    <section className="relative overflow-hidden bg-[#1F2933] text-white">
      {/* =================================================
          ROAD-STYLE BACKGROUND
      ================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle road lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute left-[15%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[35%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[65%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[85%] top-0 h-full w-px bg-white" />
        </div>

        {/* Amber glow */}
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-[#F4B400] opacity-[0.08] blur-3xl" />

        {/* Bottom road accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4B400]" />
      </div>

      {/* =================================================
          HERO CONTENT
      ================================================= */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[#F4B400]" />

          <span className="text-[#F4B400] text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
            Smart Road Reporting
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight max-w-4xl">
          Report Road Damage.
          <br />

          <span className="text-[#F4B400]">
            Improve Your City.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
          Report potholes, broken roads, cracks, waterlogging, damaged
          street lights and other road issues. Help authorities identify
          problems and improve road safety.
        </p>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}
        <div className="mt-9 flex flex-col sm:flex-row gap-3">
          {/* =================================================
              NORMAL USER BUTTONS ONLY
          ================================================= */}

          {!isAdmin && (
            <>
              {/* Report Damage */}
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 bg-[#F4B400] hover:bg-[#D99A00] text-[#1F2933] px-6 py-3 rounded-lg font-bold text-sm md:text-base transition shadow-sm"
              >
                <span>📍</span>
                Report Damage
                <span>→</span>
              </Link>

              {/* View Reports */}
              <Link
                to="/my-reports"
                className="inline-flex items-center justify-center gap-2 border border-gray-500 hover:border-white hover:bg-white hover:text-[#1F2933] text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition"
              >
                View Reports
                <span>→</span>
              </Link>
            </>
          )}
        </div>

        {/* =================================================
            TRUST / PLATFORM INFO
        ================================================= */}
        <div className="mt-12 pt-6 border-t border-white/10 max-w-2xl">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-[#F4B400]">✓</span>
              GPS-based reporting
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#F4B400]">✓</span>
              Track report status
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#F4B400]">✓</span>
              Help improve road safety
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;