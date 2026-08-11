function Statistics() {
  const stats = [
    {
      title: "Total Reports",
      value: "1250",
      icon: "📋",
      accent: "border-[#374151]",
      numberColor: "text-[#374151]",
    },
    {
      title: "Pending",
      value: "180",
      icon: "⏳",
      accent: "border-[#F4B400]",
      numberColor: "text-[#9A6700]",
    },
    {
      title: "Resolved",
      value: "1070",
      icon: "✓",
      accent: "border-green-500",
      numberColor: "text-green-600",
    },
    {
      title: "Active Users",
      value: "540",
      icon: "👥",
      accent: "border-[#66727D]",
      numberColor: "text-[#4B5563]",
    },
  ];

  return (
    <section className="py-16 bg-[#F4F5F6]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-10">

          <p className="text-[#F4B400] text-xs uppercase tracking-[0.18em] font-bold mb-2">
            Road Reporting Overview
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#374151]">
            Road Damage Statistics
          </h2>

          <p className="text-[#66727D] text-sm mt-2">
            A quick overview of reported road issues and community activity.
          </p>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {stats.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border-l-4 ${item.accent} shadow-sm hover:shadow-md transition p-5`}
            >

              <div className="flex items-center justify-between gap-3">

                {/* Text */}
                <div>

                  <p className="text-[#7A858E] text-xs font-semibold">
                    {item.title}
                  </p>

                  <h3
                    className={`text-3xl md:text-4xl font-bold mt-1 ${item.numberColor}`}
                  >
                    {item.value}
                  </h3>

                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#F4F5F6] flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Statistics;