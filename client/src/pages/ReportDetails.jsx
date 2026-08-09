import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReport(response.data.report);
      } catch (error) {
        console.error("Failed to fetch report:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load report details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">📍</div>

          <p className="text-xl font-semibold text-blue-700">
            Loading report...
          </p>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch your report.
          </p>
        </div>
      </section>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-lg w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Unable to Load Report
          </h2>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <Link
            to="/my-reports"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ← Back to My Reports
          </Link>
        </div>
      </section>
    );
  }

  if (!report) {
    return null;
  }

  // ===============================
  // STATUS STYLE
  // ===============================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";

      case "in progress":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  // ===============================
  // STATUS ICON
  // ===============================
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "✅";

      case "in progress":
        return "🔧";

      case "rejected":
        return "❌";

      default:
        return "⏳";
    }
  };

  // ===============================
  // IMAGE URL
  // ===============================
  const imageUrl = report.image
    ? report.image.startsWith("http")
      ? report.image
      : `http://localhost:5000/uploads/${report.image}`
    : null;

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ===============================
            BACK BUTTON
        =============================== */}
        <Link
          to="/my-reports"
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-semibold mb-6 transition"
        >
          ← Back to My Reports
        </Link>

        {/* ===============================
            HEADER
        =============================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Report Details
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                📍 Road Damage Report
              </h1>

              <p className="text-gray-500 mt-2 text-sm break-all">
                Report ID: {report._id || report.id}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border font-semibold ${getStatusStyle(
                report.status
              )}`}
            >
              <span>
                {getStatusIcon(report.status)}
              </span>

              <span>
                {report.status || "Pending"}
              </span>
            </div>

          </div>
        </div>

        {/* ===============================
            STATUS PROGRESS
        =============================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Report Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Pending */}
            <div
              className={`rounded-xl p-5 border ${
                report.status === "Pending"
                  ? "bg-yellow-50 border-yellow-300"
                  : report.status === "In Progress" ||
                    report.status === "Resolved"
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  ⏳
                </div>

                <div>
                  <p className="font-bold text-gray-800">
                    Submitted
                  </p>

                  <p className="text-sm text-gray-500">
                    Report received
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div
              className={`rounded-xl p-5 border ${
                report.status === "In Progress"
                  ? "bg-blue-50 border-blue-300"
                  : report.status === "Resolved"
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  🔧
                </div>

                <div>
                  <p className="font-bold text-gray-800">
                    In Progress
                  </p>

                  <p className="text-sm text-gray-500">
                    Work is underway
                  </p>
                </div>
              </div>
            </div>

            {/* Resolved */}
            <div
              className={`rounded-xl p-5 border ${
                report.status === "Resolved"
                  ? "bg-green-50 border-green-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  ✅
                </div>

                <div>
                  <p className="font-bold text-gray-800">
                    Resolved
                  </p>

                  <p className="text-sm text-gray-500">
                    Issue resolved
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ===============================
            MAIN CONTENT
        =============================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ===============================
              DAMAGE IMAGE
          =============================== */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                📷 Damage Image
              </h2>
            </div>

            {imageUrl ? (
              <div className="bg-gray-100 p-4">
                <img
                  src={imageUrl}
                  alt="Road damage"
                  className="w-full h-96 object-contain rounded-xl bg-white border"
                />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">
                    🖼️
                  </div>

                  <p className="font-medium">
                    No image uploaded
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* ===============================
              REPORT INFORMATION
          =============================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              📋 Report Information
            </h2>

            <div className="space-y-5">

              {/* Damage Type */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Damage Type
                </p>

                <p className="font-semibold text-gray-800 text-lg">
                  {report.damageType || "Not specified"}
                </p>
              </div>

              {/* Location */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Location
                </p>

                <p className="font-semibold text-gray-800">
                  {report.location || "Not available"}
                </p>
              </div>

              {/* Description */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Description
                </p>

                <p className="text-gray-700 leading-relaxed">
                  {report.description ||
                    "No description provided."}
                </p>
              </div>

              {/* Name */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Reported By
                </p>

                <p className="font-semibold text-gray-800">
                  {report.name || "Not available"}
                </p>
              </div>

              {/* Phone */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Phone
                </p>

                <p className="font-semibold text-gray-800">
                  {report.phone || "Not available"}
                </p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Submitted On
                </p>

                <p className="font-semibold text-gray-800">
                  {report.createdAt
                    ? new Date(
                        report.createdAt
                      ).toLocaleString()
                    : "Not available"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ===============================
            LOCATION DETAILS
        =============================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📍 Location Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Latitude */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm text-gray-500 mb-1">
                Latitude
              </p>

              <p className="font-semibold text-blue-700 break-all">
                {report.latitude ?? "Not available"}
              </p>
            </div>

            {/* Longitude */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm text-gray-500 mb-1">
                Longitude
              </p>

              <p className="font-semibold text-blue-700 break-all">
                {report.longitude ?? "Not available"}
              </p>
            </div>

          </div>

          {/* Google Maps */}
          {report.latitude != null &&
            report.longitude != null && (
              <a
                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                🗺️ Open Location in Google Maps
              </a>
            )}

        </div>

        {/* ===============================
            FOOTER ACTION
        =============================== */}
        <div className="mt-6 text-center">

          <Link
            to="/my-reports"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            View All My Reports
          </Link>

        </div>

      </div>
    </section>
  );
}

export default ReportDetails;