import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
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
      console.error("Failed to load dashboard:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // USER REPORT STATISTICS
  // ===============================
  const stats = {
    total: reports.length,

    pending: reports.filter(
      (report) => report.status === "Pending"
    ).length,

    inProgress: reports.filter(
      (report) => report.status === "In Progress"
    ).length,

    resolved: reports.filter(
      (report) => report.status === "Resolved"
    ).length,
  };

  // ===============================
  // RECENT REPORTS
  // ===============================
  const recentReports = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // ===============================
  // STATUS STYLE
  // ===============================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

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
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>

          <p className="text-xl font-semibold text-blue-700">
            Loading dashboard...
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
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg w-full">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Unable to Load Dashboard
          </h2>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <button
            onClick={fetchMyReports}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Try Again
          </button>

        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===============================
            HEADER
        =============================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>
            <h1 className="text-4xl font-bold text-blue-700">
              📊 Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Track your road damage reports and their status.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-center transition"
          >
            ➕ Report New Damage
          </Link>

        </div>

        {/* ===============================
            STATISTICS
        =============================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Total */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">
              📋
            </div>

            <h2 className="text-xl font-semibold text-gray-600">
              Total Reports
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-4">
              {stats.total}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-yellow-100 shadow-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">
              🟡
            </div>

            <h2 className="text-xl font-semibold text-yellow-700">
              Pending
            </h2>

            <p className="text-4xl font-bold text-yellow-700 mt-4">
              {stats.pending}
            </p>
          </div>

          {/* In Progress */}
          <div className="bg-blue-100 shadow-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">
              🔵
            </div>

            <h2 className="text-xl font-semibold text-blue-700">
              In Progress
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-4">
              {stats.inProgress}
            </p>
          </div>

          {/* Resolved */}
          <div className="bg-green-100 shadow-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">
              🟢
            </div>

            <h2 className="text-xl font-semibold text-green-700">
              Resolved
            </h2>

            <p className="text-4xl font-bold text-green-700 mt-4">
              {stats.resolved}
            </p>
          </div>

        </div>

        {/* ===============================
            RECENT REPORTS
        =============================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Reports
              </h2>

              <p className="text-gray-500 mt-1">
                Your latest road damage reports.
              </p>
            </div>

            <Link
              to="/my-reports"
              className="text-blue-700 hover:text-blue-900 font-semibold"
            >
              View All Reports →
            </Link>

          </div>

          {/* No Reports */}
          {recentReports.length === 0 ? (
            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                📭
              </div>

              <h3 className="text-xl font-semibold text-gray-700">
                No Reports Yet
              </h3>

              <p className="text-gray-500 mt-2 mb-6">
                You haven't submitted any road damage reports.
              </p>

              <Link
                to="/report"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Report Road Damage
              </Link>

            </div>
          ) : (
            <div className="space-y-4">

              {recentReports.map((report) => (
                <div
                  key={report._id}
                  className="border rounded-xl p-5 hover:shadow-md transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold text-blue-700">
                        {report.damageType}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        📍 {report.location}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(
                          report.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status || "Pending"}
                      </span>

                      <Link
                        to={`/report/${report._id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        View
                      </Link>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default Dashboard;