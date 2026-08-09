import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/reports/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Failed to load reports:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STATISTICS
  // ===============================

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  // ===============================
  // STATUS STYLE
  // ===============================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <div className="text-5xl mb-4">
              📋
            </div>

            <p className="text-xl font-semibold text-blue-700">
              Loading your reports...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* ===============================
            PAGE HEADING
        =============================== */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            My Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Track the road damage reports you have submitted.
          </p>
        </div>

        {/* ===============================
            STATISTICS
        =============================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* TOTAL REPORTS */}

          <div className="bg-white rounded-xl shadow-md p-4 text-center border-t-4 border-blue-600">
            <div className="text-3xl mb-2">
              📋
            </div>

            <h2 className="text-base font-semibold text-gray-600">
              Total Reports
            </h2>

            <p className="text-3xl font-bold text-blue-700 mt-2">
              {totalReports}
            </p>
          </div>

          {/* PENDING */}

          <div className="bg-yellow-50 rounded-xl shadow-md p-4 text-center border-t-4 border-yellow-400">
            <div className="text-3xl mb-2">
              🟡
            </div>

            <h2 className="text-base font-semibold text-yellow-700">
              Pending
            </h2>

            <p className="text-3xl font-bold text-yellow-700 mt-2">
              {pendingReports}
            </p>
          </div>

          {/* IN PROGRESS */}

          <div className="bg-blue-50 rounded-xl shadow-md p-4 text-center border-t-4 border-blue-500">
            <div className="text-3xl mb-2">
              🔵
            </div>

            <h2 className="text-base font-semibold text-blue-700">
              In Progress
            </h2>

            <p className="text-3xl font-bold text-blue-700 mt-2">
              {inProgressReports}
            </p>
          </div>

          {/* RESOLVED */}

          <div className="bg-green-50 rounded-xl shadow-md p-4 text-center border-t-4 border-green-500">
            <div className="text-3xl mb-2">
              🟢
            </div>

            <h2 className="text-base font-semibold text-green-700">
              Resolved
            </h2>

            <p className="text-3xl font-bold text-green-700 mt-2">
              {resolvedReports}
            </p>
          </div>

        </div>

        {/* ===============================
            REPORT NEW DAMAGE BUTTON
        =============================== */}

        <div className="bg-white rounded-xl shadow-md p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Your Road Damage Reports
            </h2>

            <p className="text-gray-500 mt-1 text-sm">
              View the details and current status of every report.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex justify-center items-center bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold transition"
          >
            ➕ Report New Damage
          </Link>

        </div>

        {/* ===============================
            NO REPORTS
        =============================== */}

        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <div className="text-5xl mb-4">
              📭
            </div>

            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Reports Found
            </h2>

            <p className="text-gray-500 mb-6">
              You haven't submitted any road damage reports yet.
            </p>

            <Link
              to="/report"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Report Road Damage
            </Link>

          </div>
        ) : (

          /* ===============================
             REPORTS
          =============================== */

          <div className="space-y-4">

            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >

                {/* REPORT IMAGE */}

                {report.image ? (
                  <img
                    src={
                      report.image.startsWith("http")
                        ? report.image
                        : `http://localhost:5000/uploads/${report.image}`
                    }
                    alt="Road Damage"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">

                      <div className="text-3xl mb-1">
                        🛣️
                      </div>

                      <p className="text-sm">
                        No image uploaded
                      </p>

                    </div>
                  </div>
                )}

                {/* REPORT CONTENT */}

                <div className="p-4">

                  {/* TITLE + STATUS */}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">

                    <h2 className="text-xl font-bold text-blue-700">
                      {report.damageType || "Road Damage"}
                    </h2>

                    <span
                      className={`inline-block w-fit px-3 py-1.5 rounded-full font-semibold text-xs ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status || "Pending"}
                    </span>

                  </div>

                  {/* INFORMATION */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <div>
                      <p className="text-xs text-gray-500">
                        Reporter
                      </p>

                      <p className="font-semibold text-gray-800">
                        {report.name || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="font-semibold text-gray-800">
                        {report.phone || "Not available"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500">
                        Location
                      </p>

                      <p className="font-semibold text-gray-800">
                        📍 {report.location || "Not available"}
                      </p>
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-3">

                    <p className="text-xs text-gray-500 mb-1">
                      Description
                    </p>

                    <p className="text-gray-700 text-sm">
                      {report.description || "No description provided."}
                    </p>

                  </div>

                  {/* BOTTOM */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t">

                    <p className="text-xs text-gray-500">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>

                    <Link
                      to={`/report/${report._id}`}
                      className="inline-flex justify-center items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>

        )}

      </div>
    </section>
  );
}

export default MyReports;