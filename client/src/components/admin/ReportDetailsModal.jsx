function ReportDetailsModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[700px] max-w-[95%] p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Report Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            {report.image ? (
              <img
                src={`http://localhost:5000/uploads/${report.image}`}
                alt="Road Damage"
                className="rounded-lg w-full h-72 object-cover border"
              />
            ) : (
              <div className="h-72 flex items-center justify-center border rounded-lg bg-gray-100">
                No Image
              </div>
            )}
          </div>

          <div className="space-y-3">

            <p>
              <strong>Name:</strong> {report.name}
            </p>

            <p>
              <strong>Phone:</strong> {report.phone}
            </p>

            <p>
              <strong>Location:</strong> {report.location}
            </p>

            <p>
              <strong>Damage:</strong> {report.damageType}
            </p>

            <p>
              <strong>Status:</strong> {report.status}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <div className="bg-gray-100 rounded-lg p-3">
              {report.description}
            </div>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(report.createdAt).toLocaleString()}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ReportDetailsModal;