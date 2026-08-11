function LatestReports() {
  const reports = [
    {
      id: 1,
      location: "MG Road, Bangalore",
      damage: "Large Pothole",
      status: "Pending",
    },
    {
      id: 2,
      location: "Anna Salai, Chennai",
      damage: "Road Crack",
      status: "In Progress",
    },
    {
      id: 3,
      location: "Marine Drive, Mumbai",
      damage: "Water Logging",
      status: "Resolved",
    },
  ];

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";

      case "Pending":
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";

      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return "✓";

      case "In Progress":
        return "↻";

      case "Pending":
        return "•";

      default:
        return "•";
    }
  };

  return (
    <section className="py-16 md:py-20 bg-[#252B31] border-t border-slate-700">

      <div className="max-w-7xl mx-auto px-6">

        {/* =================================================
            SECTION HEADER
        ================================================= */}
        <div className="text-center mb-10">

          <p className="text-[#F4B400] font-bold uppercase tracking-[0.18em] text-xs">
            Community Reports
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Latest Road Damage Reports
          </h2>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-3">
            See examples of road issues reported by the community and their
            current resolution status.
          </p>

        </div>

        {/* =================================================
            REPORT CARDS
        ================================================= */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">

          {reports.map((report, index) => (

            <div
              key={report.id}
              className="group bg-[#1F2933] border border-slate-700 rounded-xl p-5 md:p-6 hover:bg-[#2B3238] hover:border-slate-500 hover:shadow-md transition-all duration-200"
            >

              {/* Top Row */}
              <div className="flex items-center justify-between mb-5">

                {/* Report Number */}
                <span className="text-xs font-bold text-slate-500 tracking-wide">
                  REPORT 0{index + 1}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    report.status
                  )}`}
                >
                  <span>{getStatusIcon(report.status)}</span>
                  {report.status}
                </span>

              </div>

              {/* Damage Type */}
              <h3 className="text-xl font-bold text-white mb-3">
                {report.damage}
              </h3>

              {/* Location */}
              <div className="flex items-start gap-2 text-sm text-slate-400">

                <span className="text-[#F4B400] mt-0.5">
                  📍
                </span>

                <span>
                  {report.location}
                </span>

              </div>

              {/* Bottom Divider */}
              <div className="mt-5 pt-4 border-t border-slate-700">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Road issue reported
                  </span>

                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#F4B400] transition">
                    Community
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default LatestReports;