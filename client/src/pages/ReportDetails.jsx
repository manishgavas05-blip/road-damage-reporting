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

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="min-h-screen bg-[#23282D] flex items-center justify-center px-4">
        <div className="bg-[#2B3137] rounded-2xl border border-[#3B4249] shadow-xl p-10 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-[#41484F] border-t-[#F4B400] rounded-full animate-spin" />

          <p className="text-lg font-semibold text-white mt-5">
            Loading report...
          </p>

          <p className="text-sm text-[#AEB6BF] mt-2">
            Please wait while we fetch your report.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <section className="min-h-screen bg-[#23282D] flex items-center justify-center px-4">
        <div className="bg-[#2B3137] rounded-2xl border border-[#3B4249] shadow-xl p-10 text-center max-w-lg w-full">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Unable to Load Report
          </h2>

          <p className="text-sm text-[#AEB6BF] mb-6">
            {error}
          </p>

          <Link
            to="/my-reports"
            className="inline-flex items-center bg-[#3B4249] hover:bg-[#4A525A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
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

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

      case "in progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";

      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "✓";

      case "in progress":
        return "↻";

      case "rejected":
        return "×";

      default:
        return "•";
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================
  const imageUrl = report.image
    ? report.image.startsWith("http")
      ? report.image
      : `http://localhost:5000/uploads/${report.image}`
    : null;

  // =====================================================
  // STATUS CHECKS
  // =====================================================
  const isPending = report.status === "Pending";
  const isInProgress = report.status === "In Progress";
  const isResolved = report.status === "Resolved";

  return (
    <section className="min-h-screen bg-[#23282D] py-7 px-4 md:px-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* =================================================
            BACK BUTTON
        ================================================= */}
        <Link
          to="/my-reports"
          className="inline-flex items-center text-[#D5DADF] hover:text-[#F4B400] font-semibold text-sm mb-5 transition"
        >
          ← Back to My Reports
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="bg-[#2B3137] rounded-xl border border-[#3B4249] shadow-lg p-5 md:p-6 mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="min-w-0">
              <p className="text-[#F4B400] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                Road Reporting
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Road Damage Report
              </h1>

              <p className="text-xs text-[#8F99A3] mt-2 break-all">
                Report ID: {report._id || report.id}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border font-semibold text-sm ${getStatusStyle(
                report.status
              )}`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white/10">
                {getStatusIcon(report.status)}
              </span>

              <span>{report.status || "Pending"}</span>
            </div>

          </div>
        </div>

        {/* =================================================
            STATUS PROGRESS
        ================================================= */}
        <div className="bg-[#2B3137] rounded-xl border border-[#3B4249] shadow-lg p-5 md:p-6 mb-5">

          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-5 rounded-full bg-[#F4B400]" />

            <h2 className="text-lg font-bold text-white">
              Report Status
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Submitted */}
            <div
              className={`rounded-xl p-4 border ${
                isPending
                  ? "bg-amber-500/10 border-amber-500/30"
                  : isInProgress || isResolved
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-[#252B30] border-[#3B4249]"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                    isPending
                      ? "bg-amber-500/15 text-amber-400"
                      : isInProgress || isResolved
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-[#343B42] text-[#8F99A3]"
                  }`}
                >
                  ✓
                </div>

                <div>
                  <p className="font-bold text-white text-sm">
                    Submitted
                  </p>

                  <p className="text-xs text-[#8F99A3] mt-0.5">
                    Report received
                  </p>
                </div>

              </div>
            </div>

            {/* In Progress */}
            <div
              className={`rounded-xl p-4 border ${
                isInProgress
                  ? "bg-amber-500/10 border-amber-500/30"
                  : isResolved
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-[#252B30] border-[#3B4249]"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                    isInProgress
                      ? "bg-amber-500/15 text-amber-400"
                      : isResolved
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-[#343B42] text-[#8F99A3]"
                  }`}
                >
                  ↻
                </div>

                <div>
                  <p className="font-bold text-white text-sm">
                    In Progress
                  </p>

                  <p className="text-xs text-[#8F99A3] mt-0.5">
                    Work is underway
                  </p>
                </div>

              </div>
            </div>

            {/* Resolved */}
            <div
              className={`rounded-xl p-4 border ${
                isResolved
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-[#252B30] border-[#3B4249]"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                    isResolved
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-[#343B42] text-[#8F99A3]"
                  }`}
                >
                  ✓
                </div>

                <div>
                  <p className="font-bold text-white text-sm">
                    Resolved
                  </p>

                  <p className="text-xs text-[#8F99A3] mt-0.5">
                    Issue resolved
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* DAMAGE IMAGE */}
          <div className="bg-[#2B3137] rounded-xl border border-[#3B4249] shadow-lg overflow-hidden">

            <div className="px-5 py-4 border-b border-[#3B4249]">
              <div className="flex items-center gap-2">

                <span className="w-1.5 h-5 rounded-full bg-[#F4B400]" />

                <h2 className="text-lg font-bold text-white">
                  Damage Image
                </h2>

              </div>
            </div>

            {imageUrl ? (
              <div className="bg-[#252B30] p-4">
                <img
                  src={imageUrl}
                  alt="Road damage"
                  className="w-full h-80 object-contain rounded-lg bg-[#1F252A] border border-[#3B4249]"
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-[#252B30]">
                <div className="text-center text-[#7F8992]">

                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#343B42] flex items-center justify-center text-2xl mb-3">
                    🖼️
                  </div>

                  <p className="text-sm font-medium">
                    No image uploaded
                  </p>

                </div>
              </div>
            )}

          </div>

          {/* REPORT INFORMATION */}
          <div className="bg-[#2B3137] rounded-xl border border-[#3B4249] shadow-lg p-5">

            <div className="flex items-center gap-2 mb-5">

              <span className="w-1.5 h-5 rounded-full bg-[#F4B400]" />

              <h2 className="text-lg font-bold text-white">
                Report Information
              </h2>

            </div>

            <div className="space-y-4">

              <div className="border-b border-[#3B4249] pb-4">
                <p className="text-xs text-[#7F8992] mb-1">
                  Damage Type
                </p>

                <p className="font-semibold text-white">
                  {report.damageType || "Not specified"}
                </p>
              </div>

              <div className="border-b border-[#3B4249] pb-4">
                <p className="text-xs text-[#7F8992] mb-1">
                  Location
                </p>

                <p className="font-semibold text-white">
                  {report.location || "Not available"}
                </p>
              </div>

              <div className="border-b border-[#3B4249] pb-4">
                <p className="text-xs text-[#7F8992] mb-1">
                  Description
                </p>

                <p className="text-sm text-[#C3C9CE] leading-relaxed">
                  {report.description || "No description provided."}
                </p>
              </div>

              <div className="border-b border-[#3B4249] pb-4">
                <p className="text-xs text-[#7F8992] mb-1">
                  Reported By
                </p>

                <p className="font-semibold text-white">
                  {report.name || "Not available"}
                </p>
              </div>

              <div className="border-b border-[#3B4249] pb-4">
                <p className="text-xs text-[#7F8992] mb-1">
                  Phone
                </p>

                <p className="font-semibold text-white">
                  {report.phone || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7F8992] mb-1">
                  Submitted On
                </p>

                <p className="font-semibold text-white">
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            RESOLUTION NOTE
        ================================================= */}
        {report.status === "Resolved" &&
          report.resolutionNote && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-5 mt-5">

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-bold text-emerald-400">
                    Resolution Note
                  </p>

                  <p className="text-sm text-emerald-200 mt-1 leading-relaxed">
                    {report.resolutionNote}
                  </p>
                </div>

              </div>

            </div>
          )}

        {/* =================================================
            LOCATION DETAILS
        ================================================= */}
        <div className="bg-[#2B3137] rounded-xl border border-[#3B4249] shadow-lg p-5 mt-5">

          <div className="flex items-center gap-2 mb-5">

            <span className="w-1.5 h-5 rounded-full bg-[#F4B400]" />

            <h2 className="text-lg font-bold text-white">
              Location Details
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <div className="bg-[#252B30] rounded-lg p-4 border border-[#3B4249]">
              <p className="text-xs text-[#7F8992] mb-1">
                Latitude
              </p>

              <p className="font-semibold text-white text-sm break-all">
                {report.latitude ?? "Not available"}
              </p>
            </div>

            <div className="bg-[#252B30] rounded-lg p-4 border border-[#3B4249]">
              <p className="text-xs text-[#7F8992] mb-1">
                Longitude
              </p>

              <p className="font-semibold text-white text-sm break-all">
                {report.longitude ?? "Not available"}
              </p>
            </div>

          </div>

          {report.latitude != null &&
            report.longitude != null && (
              <a
                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 bg-[#3B4249] hover:bg-[#4A525A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                🗺️ Open Location in Google Maps
              </a>
            )}

        </div>

        {/* =================================================
            FOOTER ACTION
        ================================================= */}
        <div className="mt-5 text-center">

          <Link
            to="/my-reports"
            className="inline-flex items-center bg-[#3B4249] hover:bg-[#4A525A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            View All My Reports
          </Link>

        </div>

      </div>
    </section>
  );
}

export default ReportDetails;