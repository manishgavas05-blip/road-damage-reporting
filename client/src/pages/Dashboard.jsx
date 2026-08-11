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

  // =====================================================
  // FETCH MY REPORTS
  // =====================================================
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
      setError("");
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

  // =====================================================
  // USER REPORT STATISTICS
  // =====================================================
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

  // =====================================================
  // RECENT REPORTS
  // =====================================================
  const recentReports = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "In Progress":
        return "bg-amber-50 text-amber-700 border border-amber-200";

      case "Pending":
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return "✓";

      case "In Progress":
        return "↻";

      case "Pending":
      default:
        return "○";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="min-h-screen bg-[#F5F6F7] py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">

            <div className="w-9 h-9 mx-auto border-4 border-slate-200 border-t-amber-400 rounded-full animate-spin" />

            <p className="text-sm font-semibold text-slate-600 mt-4">
              Loading Dashboard...
            </p>

          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <section className="min-h-screen bg-[#F5F6F7] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-lg w-full">

          <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 flex items-center justify-center text-xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-[#4B5157] mb-2">
            Unable to Load Dashboard
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            {error}
          </p>

          <button
            onClick={() => {
              setLoading(true);
              fetchMyReports();
            }}
            className="bg-[#4B5157] hover:bg-[#5A6168] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
          >
            Try Again
          </button>

        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F6F7] py-7 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#4B5157] flex items-center justify-center shadow-sm">
                <span className="text-amber-400 text-lg">
                  📊
                </span>
              </div>

              <div>
                <p className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Road Reporting
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-[#4B5157] tracking-tight">
                  My Dashboard
                </h1>
              </div>

            </div>

            <p className="text-slate-500 mt-2 text-sm">
              Track your road damage reports and monitor their progress.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center justify-center gap-2 bg-[#4B5157] hover:bg-[#5A6168] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm"
          >
            <span className="text-amber-400">
              +
            </span>
            Report New Damage
          </Link>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          {/* Total */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  Total Reports
                </p>

                <p className="text-2xl font-bold text-[#4B5157] mt-1">
                  {stats.total}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-base">
                📋
              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  Pending
                </p>

                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {stats.pending}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-base">
                🟡
              </div>

            </div>

          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  In Progress
                </p>

                <p className="text-2xl font-bold text-slate-600 mt-1">
                  {stats.inProgress}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-base">
                🔵
              </div>

            </div>

          </div>

          {/* Resolved */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  Resolved
                </p>

                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {stats.resolved}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-base">
                🟢
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            RECENT REPORTS
        ===================================================== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Reports Header */}
          <div className="px-5 py-4 border-b border-slate-200">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <div className="flex items-center gap-2">

                  <span className="w-1.5 h-5 rounded-full bg-amber-400" />

                  <h2 className="text-xl font-bold text-[#4B5157]">
                    Recent Reports
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest road damage reports.
                </p>
              </div>

              <Link
                to="/my-reports"
                className="text-sm text-[#4B5157] hover:text-amber-600 font-semibold transition"
              >
                View All Reports →
              </Link>

            </div>

          </div>

          {/* =====================================================
              NO REPORTS
          ===================================================== */}
          {recentReports.length === 0 ? (
            <div className="text-center py-14 px-5">

              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4">
                📭
              </div>

              <h3 className="text-lg font-semibold text-[#4B5157]">
                No Reports Yet
              </h3>

              <p className="text-sm text-slate-500 mt-1 mb-5">
                You haven't submitted any road damage reports.
              </p>

              <Link
                to="/report"
                className="inline-flex items-center gap-2 bg-[#4B5157] hover:bg-[#5A6168] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                <span className="text-amber-400">
                  +
                </span>
                Report Road Damage
              </Link>

            </div>
          ) : (

            /* =====================================================
               REPORT LIST
            ===================================================== */
            <div className="divide-y divide-slate-200">

              {recentReports.map((report) => (

                <div
                  key={report._id}
                  className="p-4 md:p-5 hover:bg-slate-50/70 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Report Information */}
                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <span className="w-1.5 h-5 rounded-full bg-amber-400 flex-shrink-0" />

                        <h3 className="text-base font-bold text-[#4B5157] truncate">
                          {report.damageType || "Road Damage"}
                        </h3>

                      </div>

                      <p className="text-sm text-slate-500 mt-1 truncate">
                        <span className="text-amber-500">
                          📍
                        </span>{" "}
                        {report.location || "Location unavailable"}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {report.createdAt
                          ? new Date(
                              report.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                    {/* Status + View */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        <span>
                          {getStatusIcon(report.status)}
                        </span>

                        {report.status || "Pending"}
                      </span>

                      <Link
                        to={`/report/${report._id}`}
                        className="bg-[#4B5157] hover:bg-[#5A6168] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
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

        {/* =====================================================
            BOTTOM ACTION
        ===================================================== */}
        {recentReports.length > 0 && (
          <div className="flex justify-center mt-5">

            <Link
              to="/my-reports"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B5157] hover:text-amber-600 transition"
            >
              View all your reports
              <span>→</span>
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}

export default Dashboard;