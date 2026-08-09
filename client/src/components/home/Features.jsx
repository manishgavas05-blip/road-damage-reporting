import { FaMapMarkedAlt, FaCamera, FaClipboardCheck } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-5xl text-blue-600 mx-auto mb-4" />,
      title: "Location Tracking",
      description:
        "Report the exact road damage location using GPS or an interactive map.",
    },
    {
      icon: <FaCamera className="text-5xl text-green-600 mx-auto mb-4" />,
      title: "Upload Images",
      description:
        "Attach photos of potholes or damaged roads for accurate reporting.",
    },
    {
      icon: <FaClipboardCheck className="text-5xl text-red-600 mx-auto mb-4" />,
      title: "Track Status",
      description:
        "Monitor your submitted reports until they are resolved.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Use Our System?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="shadow-lg rounded-xl p-8 text-center hover:shadow-2xl transition"
            >
              {feature.icon}

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600">
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