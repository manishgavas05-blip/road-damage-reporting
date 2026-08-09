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

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Latest Road Damage Reports
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {reports.map((report) => (

            <div
              key={report.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <h3 className="text-2xl font-semibold mb-3">
                {report.damage}
              </h3>

              <p className="text-gray-600">
                📍 {report.location}
              </p>

              <span
                className={`inline-block mt-5 px-4 py-2 rounded-full text-white
                  ${
                    report.status === "Resolved"
                      ? "bg-green-600"
                      : report.status === "Pending"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
              >
                {report.status}
              </span>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default LatestReports;