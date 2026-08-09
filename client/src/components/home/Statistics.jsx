function Statistics() {
  const stats = [
    {
      title: "Total Reports",
      value: "1250",
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: "180",
      color: "text-red-500",
    },
    {
      title: "Resolved",
      value: "1070",
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: "540",
      color: "text-yellow-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Road Damage Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-8 text-center"
            >
              <h3 className={`text-5xl font-bold ${item.color}`}>
                {item.value}
              </h3>

              <p className="mt-4 text-lg">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Statistics;