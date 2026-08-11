import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // =====================================================
  // RESOLUTION NOTES
  // =====================================================

  const resolutionNotes = {
    Pothole:
      "Pothole repaired and the damaged road surface has been restored.",

    "Road Crack":
      "Road cracks repaired and the affected road surface has been restored.",

    "Broken Road":
      "Damaged road section repaired and the road surface has been restored.",

    "Water Logging":
      "Water logging issue addressed and the affected drainage area has been cleared.",

    "Street Light Damage":
      "Damaged street light repaired and normal lighting service has been restored.",
  };

  // =====================================================
  // GET REPORTS + STATS
  // =====================================================

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  const fetchReports = async () => {
    try {
      const token = getToken();

      const response = await axios.get(
        "http://localhost:5000/api/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.reports || []);
    } catch (error) {
      console.error("Failed to load reports:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to access the Admin Dashboard.");
      } else {
        alert("Failed to load reports.");
      }
    }
  };

  // =====================================================
  // FETCH STATISTICS
  // =====================================================

  const fetchStats = async () => {
    try {
      const token = getToken();

      const response = await axios.get(
        "http://localhost:5000/api/reports/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        total: response.data.total || 0,
        pending: response.data.pending || 0,
        inProgress: response.data.inProgress || 0,
        resolved: response.data.resolved || 0,
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN STATUS UPDATE
  // =====================================================

  const openStatusUpdate = (report) => {
    setSelectedReport(report);
    setSelectedStatus(report.status || "Pending");

    if (report.status === "Resolved") {
      setResolutionNote(
        report.resolutionNote ||
          resolutionNotes[report.damageType] ||
          ""
      );
    } else {
      setResolutionNote("");
    }
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    setSelectedStatus(newStatus);

    if (newStatus === "Resolved") {
      const fixedNote =
        resolutionNotes[selectedReport?.damageType] ||
        "Road damage has been repaired and the affected area has been restored.";

      setResolutionNote(fixedNote);
    } else {
      setResolutionNote("");
    }
  };

  // =====================================================
  // UPDATE REPORT
  // =====================================================

  const updateStatus = async () => {
    if (!selectedReport) return;

    if (!selectedStatus) {
      alert("Please select a status.");
      return;
    }

    if (
      selectedStatus === "Resolved" &&
      !resolutionNote.trim()
    ) {
      alert("Resolution note is required.");
      return;
    }

    try {
      const token = getToken();

      const response = await axios.put(
        `http://localhost:5000/api/reports/${selectedReport._id}`,
        {
          status: selectedStatus,
          resolutionNote:
            selectedStatus === "Resolved"
              ? resolutionNote
              : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Report status updated successfully."
      );

      setSelectedReport(null);
      setSelectedStatus("");
      setResolutionNote("");

      await fetchReports();
      await fetchStats();
    } catch (error) {
      console.error("Failed to update status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update report status."
      );
    }
  };

  // =====================================================
  // DELETE REPORT
  // =====================================================

  const deleteReport = async (reportId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      const response = await axios.delete(
        `http://localhost:5000/api/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Report deleted successfully."
      );

      await fetchReports();
      await fetchStats();
    } catch (error) {
      console.error("Failed to delete report:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete report."
      );
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";

      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";

      case "Pending":
      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/30";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-[#1F2328] py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-9 h-9 mx-auto border-4 border-[#3A3F45] border-t-[#F4B400] rounded-full animate-spin" />

            <p className="text-sm font-semibold text-white mt-4">
              Loading Admin Dashboard...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <section className="min-h-screen bg-[#1F2328] py-7 px-4 md:px-6 text-white">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#3A3F45] flex items-center justify-center shadow-sm border border-[#4A5057]">
              <span className="text-amber-400 text-lg">
                🚧
              </span>
            </div>

            <div>

              <p className="text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                Road Reporting
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>

            </div>

          </div>

          <p className="text-gray-400 mt-2 text-sm">
            Manage reported road issues, monitor progress, and update report status.
          </p>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          {/* Total */}

          <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 hover:bg-[#2D3238] transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                  Total Reports
                </p>

                <p className="text-2xl font-bold text-white mt-1">
                  {stats.total}
                </p>

              </div>

              <div className="w-9 h-9 rounded-lg bg-[#343A40] border border-[#454B52] flex items-center justify-center text-base">
                📋
              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 hover:bg-[#2D3238] transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                  Pending
                </p>

                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {stats.pending}
                </p>

              </div>

              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-base">
                🟡
              </div>

            </div>

          </div>

          {/* In Progress */}

          <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 hover:bg-[#2D3238] transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                  In Progress
                </p>

                <p className="text-2xl font-bold text-white mt-1">
                  {stats.inProgress}
                </p>

              </div>

              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-base">
                🔵
              </div>

            </div>

          </div>

          {/* Resolved */}

          <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 hover:bg-[#2D3238] transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                  Resolved
                </p>

                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {stats.resolved}
                </p>

              </div>

              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base">
                🟢
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            REPORTS
        ================================================= */}

        <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm overflow-hidden">

          {/* Reports Header */}

          <div className="px-5 py-4 border-b border-[#3A3F45] bg-[#292D32]">

            <div className="flex items-center justify-between gap-3">

              <div>

                <h2 className="text-xl font-bold text-white">
                  All Reports
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Review and manage submitted road damage reports.
                </p>

              </div>

              <div className="hidden sm:flex w-9 h-9 rounded-lg bg-[#3A3F45] border border-[#4A5057] items-center justify-center">

                <span className="text-amber-400">
                  📋
                </span>

              </div>

            </div>

          </div>

          {/* Empty State */}

          {reports.length === 0 ? (

            <div className="text-center py-14 px-5">

              <div className="w-12 h-12 mx-auto rounded-xl bg-[#343A40] border border-[#454B52] flex items-center justify-center text-2xl mb-4">
                📭
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Reports Found
              </h3>

              <p className="text-gray-400 mt-1 text-sm">
                There are currently no road damage reports.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-[#3A3F45]">

              {reports.map((report) => (

                <div
                  key={report._id}
                  className="p-4 md:p-5 hover:bg-[#2D3238] transition"
                >

                  <div className="flex flex-col lg:flex-row gap-4">

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="w-full lg:w-48 flex-shrink-0">

                      {report.image ? (

                        <img
                          src={`http://localhost:5000/uploads/${report.image}`}
                          alt="Road Damage"
                          className="w-full h-32 object-cover rounded-lg border border-[#454B52]"
                        />

                      ) : (

                        <div className="w-full h-32 rounded-lg bg-[#343A40] border border-[#454B52] flex items-center justify-center">

                          <div className="text-center text-gray-500">

                            <div className="text-2xl mb-1">
                              🛣️
                            </div>

                            <p className="text-xs">
                              No image
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="flex-1 min-w-0">

                      {/* TITLE + STATUS */}

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <span className="w-1.5 h-5 rounded-full bg-amber-400" />

                            <h3 className="text-lg font-bold text-white">
                              {report.damageType}
                            </h3>

                          </div>

                          <p className="text-sm text-gray-400 mt-1 truncate">

                            <span className="text-amber-400">
                              📍
                            </span>{" "}

                            {report.location}

                          </p>

                        </div>

                        <span
                          className={`w-fit px-3 py-1.5 rounded-full font-semibold text-xs ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {report.status || "Pending"}
                        </span>

                      </div>

                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-4">

                        <div>

                          <p className="text-xs text-gray-500">
                            Reporter
                          </p>

                          <p className="font-semibold text-gray-200 text-sm mt-0.5">
                            {report.name}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Phone
                          </p>

                          <p className="font-semibold text-gray-200 text-sm mt-0.5">
                            {report.phone}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Submitted
                          </p>

                          <p className="font-semibold text-gray-200 text-sm mt-0.5">
                            {report.createdAt
                              ? new Date(
                                  report.createdAt
                                ).toLocaleString()
                              : "N/A"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Coordinates
                          </p>

                          <p className="font-semibold text-gray-200 text-sm mt-0.5 break-words">
                            {report.latitude},{" "}
                            {report.longitude}
                          </p>

                        </div>

                      </div>

                      {/* =================================================
                          DESCRIPTION
                      ================================================= */}

                      <div className="mt-4">

                        <p className="text-xs text-gray-500 mb-1">
                          Description
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed">
                          {report.description}
                        </p>

                      </div>

                      {/* =================================================
                          RESOLUTION NOTE
                      ================================================= */}

                      {report.status === "Resolved" &&
                        report.resolutionNote && (

                          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5">

                            <div className="flex items-start gap-2">

                              <div className="w-6 h-6 flex-shrink-0 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-bold">
                                ✓
                              </div>

                              <div>

                                <p className="text-xs font-semibold text-emerald-400 mb-1">
                                  Resolution Note
                                </p>

                                <p className="text-sm text-emerald-300">
                                  {report.resolutionNote}
                                </p>

                              </div>

                            </div>

                          </div>

                        )}

                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <div className="flex flex-wrap gap-2 mt-4">

                        <button
                          onClick={() =>
                            openStatusUpdate(report)
                          }
                          className="bg-[#3A3F45] hover:bg-[#4A5057] text-white border border-[#50565D] px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                        >
                          Update Status
                        </button>

                        <button
                          onClick={() =>
                            deleteReport(report._id)
                          }
                          className="bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ===================================================
          UPDATE STATUS MODAL
      =================================================== */}

      {selectedReport && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-center justify-center px-4">

          <div className="bg-[#292D32] w-full max-w-md rounded-2xl shadow-2xl p-5 border border-[#454B52]">

            {/* Modal Header */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-amber-400 text-[10px] uppercase tracking-[0.18em] font-bold">
                  Road Reporting
                </p>

                <h2 className="text-xl font-bold text-white">
                  Update Report
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {selectedReport.damageType}
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setResolutionNote("");
                }}
                className="w-8 h-8 rounded-lg bg-[#343A40] text-gray-400 hover:bg-[#454B52] hover:text-white text-xl leading-none transition"
              >
                ×
              </button>

            </div>

            {/* Status */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Report Status
              </label>

              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full border border-[#50565D] bg-[#1F2328] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>

            {/* Resolution Note */}

            {selectedStatus === "Resolved" && (

              <div className="mb-4">

                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Resolution Note
                </label>

                <textarea
                  value={resolutionNote}
                  readOnly
                  rows="3"
                  className="w-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none"
                />

                <p className="text-xs text-gray-500 mt-1.5">
                  This note is automatically generated based on the damage type.
                </p>

              </div>

            )}

            {/* Buttons */}

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedStatus("");
                  setResolutionNote("");
                }}
                className="flex-1 border border-[#50565D] hover:bg-[#343A40] text-gray-300 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                className="flex-1 bg-[#F4B400] hover:bg-[#D99A00] text-[#1F2328] py-2.5 rounded-lg text-sm font-bold transition shadow-sm"
              >
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default AdminDashboard;