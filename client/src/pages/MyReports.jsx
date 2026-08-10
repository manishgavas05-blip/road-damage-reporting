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
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-3">📋</div>

            <p className="text-lg font-semibold text-blue-700">
              Loading your reports...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* ===============================
            PAGE HEADING
        =============================== */}

        <div className="text-center mb-7">

          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            My Reports
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Track the road damage reports you have submitted.
          </p>

        </div>

        {/* ===============================
            STATISTICS
        =============================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          {/* TOTAL */}

          <div className="bg-white rounded-lg shadow-sm p-3 text-center border-t-4 border-blue-600">

            <div className="text-2xl mb-1">
              📋
            </div>

            <h2 className="text-sm font-semibold text-gray-600">
              Total Reports
            </h2>

            <p className="text-2xl font-bold text-blue-700 mt-1">
              {totalReports}
            </p>

          </div>

          {/* PENDING */}

          <div className="bg-yellow-50 rounded-lg shadow-sm p-3 text-center border-t-4 border-yellow-400">

            <div className="text-2xl mb-1">
              🟡
            </div>

            <h2 className="text-sm font-semibold text-yellow-700">
              Pending
            </h2>

            <p className="text-2xl font-bold text-yellow-700 mt-1">
              {pendingReports}
            </p>

          </div>

          {/* IN PROGRESS */}

          <div className="bg-blue-50 rounded-lg shadow-sm p-3 text-center border-t-4 border-blue-500">

            <div className="text-2xl mb-1">
              🔵
            </div>

            <h2 className="text-sm font-semibold text-blue-700">
              In Progress
            </h2>

            <p className="text-2xl font-bold text-blue-700 mt-1">
              {inProgressReports}
            </p>

          </div>

          {/* RESOLVED */}

          <div className="bg-green-50 rounded-lg shadow-sm p-3 text-center border-t-4 border-green-500">

            <div className="text-2xl mb-1">
              🟢
            </div>

            <h2 className="text-sm font-semibold text-green-700">
              Resolved
            </h2>

            <p className="text-2xl font-bold text-green-700 mt-1">
              {resolvedReports}
            </p>

          </div>

        </div>

        {/* ===============================
            HEADER / NEW REPORT
        =============================== */}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <h2 className="text-lg font-bold text-gray-800">
              Your Road Damage Reports
            </h2>

            <p className="text-gray-500 text-xs mt-1">
              View the details and current status of every report.
            </p>

          </div>

          <Link
            to="/report"
            className="inline-flex justify-center items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
          >
            ➕ Report New Damage
          </Link>

        </div>

        {/* ===============================
            NO REPORTS
        =============================== */}

        {reports.length === 0 ? (

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">

            <div className="text-4xl mb-3">
              📭
            </div>

            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No Reports Found
            </h2>

            <p className="text-gray-500 text-sm mb-5">
              You haven't submitted any road damage reports yet.
            </p>

            <Link
              to="/report"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold text-sm transition"
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
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
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
                    className="w-full h-32 sm:h-36 object-cover"
                  />

                ) : (

                  <div className="w-full h-20 bg-gray-100 flex items-center justify-center">

                    <div className="text-center text-gray-400">

                      <div className="text-2xl mb-1">
                        🛣️
                      </div>

                      <p className="text-xs">
                        No image uploaded
                      </p>

                    </div>

                  </div>

                )}

                {/* REPORT CONTENT */}

                <div className="p-4">

                  {/* TITLE + STATUS */}

                  <div className="flex items-center justify-between gap-3 mb-3">

                    <h2 className="text-lg font-bold text-blue-700">
                      {report.damageType || "Road Damage"}
                    </h2>

                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status || "Pending"}
                    </span>

                  </div>

                  {/* INFORMATION */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">

                    <div>

                      <p className="text-xs text-gray-400">
                        Reporter
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {report.name || "Not available"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {report.phone || "Not available"}
                      </p>

                    </div>

                    <div className="sm:col-span-2">

                      <p className="text-xs text-gray-400">
                        Location
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        📍 {report.location || "Not available"}
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-3">

                    <p className="text-xs text-gray-400 mb-1">
                      Description
                    </p>

                    <p className="text-sm text-gray-700">
                      {report.description ||
                        "No description provided."}
                    </p>

                  </div>

                  {/* BOTTOM */}

                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t">

                    <p className="text-xs text-gray-400">

                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}

                    </p>

                    <Link
                      to={`/report/${report._id}`}
                      className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-md font-semibold text-xs transition"
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