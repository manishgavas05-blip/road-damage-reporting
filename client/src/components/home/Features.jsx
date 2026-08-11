import {
  FaMapMarkedAlt,
  FaCamera,
  FaClipboardCheck,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: "Location Tracking",
      description:
        "Report the exact road damage location using GPS or an interactive map.",
      label: "GPS",
    },
    {
      icon: <FaCamera />,
      title: "Upload Images",
      description:
        "Attach clear photos of potholes or damaged roads for accurate reporting.",
      label: "PHOTO",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Track Status",
      description:
        "Monitor your submitted reports and follow their progress until resolution.",
      label: "TRACK",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#1F2933] border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6">

        {/* =================================================
            SECTION HEADER
        ================================================= */}
        <div className="text-center mb-12">

          <p className="text-[#F4B400] font-bold uppercase tracking-[0.18em] text-xs">
            How It Works
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Simple. Accurate. Transparent.
          </h2>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Everything you need to report road problems and keep track of
            their progress in one place.
          </p>

        </div>

        {/* =================================================
            FEATURE CARDS
        ================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-[#252B31] border border-slate-700 rounded-xl p-6 md:p-7 hover:bg-[#2B3238] hover:border-slate-500 hover:shadow-md transition-all duration-200"
            >

              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-[#F4B400] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Icon + Label */}
              <div className="flex items-center justify-between mb-6">

                <div className="w-11 h-11 rounded-lg bg-[#1F2933] border border-slate-600 text-[#F4B400] flex items-center justify-center text-lg">
                  {feature.icon}
                </div>

                <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
                  {feature.label}
                </span>

              </div>

              {/* Number */}
              <div className="text-xs font-bold text-slate-500 mb-2">
                0{index + 1}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;