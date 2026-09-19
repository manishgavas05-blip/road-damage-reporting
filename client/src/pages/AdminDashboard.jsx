import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// =====================================================
// API URL
// =====================================================
const API_URL = "http://localhost:5000/api/reports";
const SERVER_URL = "http://localhost:5000";

// =====================================================
// PRIORITY SCORE CALCULATION
// =====================================================
const calculatePriority = (report) => {
  let score = 30;

  const damage = (report.damageType || "").toLowerCase();

  if (
    damage.includes("major") ||
    damage.includes("deep") ||
    damage.includes("severe") ||
    damage.includes("pothole")
  ) {
    score += 35;
  } else if (
    damage.includes("crack") ||
    damage.includes("broken") ||
    damage.includes("damaged")
  ) {
    score += 20;
  } else {
    score += 10;
  }

  if (report.createdAt && report.status !== "Resolved") {
    const ageInDays =
      (Date.now() - new Date(report.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (ageInDays >= 30) score += 25;
    else if (ageInDays >= 14) score += 18;
    else if (ageInDays >= 7) score += 12;
    else if (ageInDays >= 3) score += 6;
  }

  if (report.status === "Resolved") {
    score = 5;
  } else if (report.status === "In Progress") {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
};

// =====================================================
// PRIORITY LEVEL
// =====================================================
const getPriority = (score) => {
  if (score >= 80) {
    return {
      label: "Critical",
      color: "text-red-400",
      badge: "bg-red-500/10 text-red-400 border border-red-500/30",
      bar: "bg-red-500",
    };
  }

  if (score >= 60) {
    return {
      label: "High",
      color: "text-orange-400",
      badge:
        "bg-orange-500/10 text-orange-400 border border-orange-500/30",
      bar: "bg-orange-500",
    };
  }

  if (score >= 35) {
    return {
      label: "Medium",
      color: "text-amber-400",
      badge:
        "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      bar: "bg-amber-400",
    };
  }

  return {
    label: "Low",
    color: "text-emerald-400",
    badge:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    bar: "bg-emerald-500",
  };
};

// =====================================================
// PRIORITY BADGE
// =====================================================
function PriorityBadge({ report }) {
  const score = calculatePriority(report);
  const priority = getPriority(score);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-bold ${priority.badge}`}
      >
        {priority.label} Priority
      </span>

      <span className={`text-sm font-bold ${priority.color}`}>
        {score}/100
      </span>
    </div>
  );
}

// =====================================================
// DATE FORMATTER
// =====================================================
const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// =====================================================
// DATE FOR INPUT[type=date]
// =====================================================
const toDateInputValue = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// REPAIR TRACKING STATUS
// =====================================================
const getRepairTracking = (report) => {
  if (report.status === "Resolved") {
    return {
      label: "Repair Completed",
      style:
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    };
  }

  if (report.isOverdue) {
    return {
      label: `Overdue${report.delayDays ? ` · ${report.delayDays} day(s)` : ""}`,
      style: "bg-red-500/10 text-red-400 border border-red-500/30",
    };
  }

  if (
    report.estimatedCompletionDate &&
    new Date(report.estimatedCompletionDate).toDateString() ===
      new Date().toDateString()
  ) {
    return {
      label: "Due Today",
      style:
        "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    };
  }

  if (!report.estimatedCompletionDate) {
    return {
      label: "Estimate Unavailable",
      style: "bg-slate-500/10 text-slate-300 border border-slate-500/30",
    };
  }

  return {
    label: "On Schedule",
    style:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  };
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================
function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Repair estimate revision
  const [revisedEstimatedDate, setRevisedEstimatedDate] = useState("");
  const [delayReason, setDelayReason] = useState("");

  const [sortByPriority, setSortByPriority] = useState(true);
  const [saving, setSaving] = useState(false);

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
  // TOKEN
  // =====================================================
  const getToken = () => localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([fetchReports(), fetchStats()]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  // =====================================================
  // FETCH REPORTS
  // =====================================================
  const fetchReports = async () => {
    try {
      const response = await axios.get(API_URL, getAuthConfig());

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
      const response = await axios.get(
        `${API_URL}/stats`,
        getAuthConfig()
      );

      setStats({
        total: response.data.total || 0,
        pending: response.data.pending || 0,
        inProgress: response.data.inProgress || 0,
        resolved: response.data.resolved || 0,
        overdue: response.data.overdue || 0,
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  // =====================================================
  // SORT REPORTS
  // =====================================================
  const sortedReports = useMemo(() => {
    const reportsCopy = [...reports];

    if (sortByPriority) {
      reportsCopy.sort(
        (a, b) => calculatePriority(b) - calculatePriority(a)
      );
    } else {
      reportsCopy.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return reportsCopy;
  }, [reports, sortByPriority]);

  // =====================================================
  // PRIORITY COUNTS
  // =====================================================
  const priorityCounts = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    reports.forEach((report) => {
      const score = calculatePriority(report);

      if (score >= 80) counts.critical++;
      else if (score >= 60) counts.high++;
      else if (score >= 35) counts.medium++;
      else counts.low++;
    });

    return counts;
  }, [reports]);

  // =====================================================
  // OPEN STATUS UPDATE MODAL
  // =====================================================
  const openStatusUpdate = (report) => {
    setSelectedReport(report);
    setSelectedStatus(report.status || "Pending");

    setResolutionNote(
      report.status === "Resolved"
        ? report.resolutionNote ||
            resolutionNotes[report.damageType] ||
            ""
        : ""
    );

    setRevisedEstimatedDate("");
    setDelayReason("");
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  const closeModal = () => {
    setSelectedReport(null);
    setSelectedStatus("");
    setResolutionNote("");
    setRevisedEstimatedDate("");
    setDelayReason("");
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
  // UPDATE REPORT STATUS + ESTIMATE
  // =====================================================
  const updateStatus = async () => {
    if (!selectedReport || saving) return;

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

    if (revisedEstimatedDate) {
      const revisedDate = new Date(`${revisedEstimatedDate}T23:59:59`);

      if (Number.isNaN(revisedDate.getTime())) {
        alert("Please select a valid revised completion date.");
        return;
      }

      if (revisedDate <= new Date()) {
        alert("Revised completion date must be in the future.");
        return;
      }

      if (!delayReason.trim()) {
        alert("Please enter a reason for revising the repair estimate.");
        return;
      }
    }

    const updateData = {
      status: selectedStatus,
      resolutionNote:
        selectedStatus === "Resolved" ? resolutionNote : "",
    };

    if (revisedEstimatedDate) {
      updateData.revisedEstimatedDate = revisedEstimatedDate;
      updateData.delayReason = delayReason.trim();
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/${selectedReport._id}`,
        updateData,
        getAuthConfig()
      );

      alert(
        response.data.message || "Report updated successfully."
      );

      closeModal();

      await Promise.all([fetchReports(), fetchStats()]);
    } catch (error) {
      console.error("Failed to update report:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update report."
      );
    } finally {
      setSaving(false);
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
      const response = await axios.delete(
        `${API_URL}/${reportId}`,
        getAuthConfig()
      );

      alert(
        response.data.message || "Report deleted successfully."
      );

      await Promise.all([fetchReports(), fetchStats()]);
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
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3A3F45] flex items-center justify-center shadow-sm border border-[#4A5057]">
              <span className="text-amber-400 text-lg">🚧</span>
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
            Manage road issues, monitor repair progress, and prioritize
            reports based on urgency.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            title="Total Reports"
            value={stats.total}
            icon="📋"
            valueColor="text-white"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon="🟡"
            valueColor="text-amber-400"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="🔵"
            valueColor="text-white"
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon="🟢"
            valueColor="text-emerald-400"
          />

          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon="⏰"
            valueColor="text-red-400"
          />
        </div>

        {/* PRIORITY OVERVIEW */}
        <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                🚦 Road Damage Priority Overview
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Reports grouped by their calculated priority score.
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {reports.length} reports analyzed
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <PriorityCount
              label="Critical"
              count={priorityCounts.critical}
              color="text-red-400"
              bg="bg-red-500/10 border-red-500/20"
            />

            <PriorityCount
              label="High"
              count={priorityCounts.high}
              color="text-orange-400"
              bg="bg-orange-500/10 border-orange-500/20"
            />

            <PriorityCount
              label="Medium"
              count={priorityCounts.medium}
              color="text-amber-400"
              bg="bg-amber-500/10 border-amber-500/20"
            />

            <PriorityCount
              label="Low"
              count={priorityCounts.low}
              color="text-emerald-400"
              bg="bg-emerald-500/10 border-emerald-500/20"
            />
          </div>
        </div>

        {/* ALL REPORTS */}
        <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm overflow-hidden">
          {/* REPORTS HEADER */}
          <div className="px-5 py-4 border-b border-[#3A3F45]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  All Reports
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Review, prioritize, and manage submitted road damage
                  reports.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSortByPriority((prev) => !prev)}
                className="px-4 py-2 rounded-lg bg-[#3A3F45] hover:bg-[#454B52] border border-[#50565D] text-sm font-semibold transition"
              >
                {sortByPriority
                  ? "🔴 Sorted: Highest Priority"
                  : "🕒 Sort: Newest First"}
              </button>
            </div>
          </div>

          {/* EMPTY STATE */}
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
              {sortedReports.map((report) => {
                const score = calculatePriority(report);
                const priority = getPriority(score);
                const tracking = getRepairTracking(report);

                return (
                  <div
                    key={report._id}
                    className="p-4 md:p-5 hover:bg-[#2D3238] transition"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* IMAGE */}
                      <div className="w-full lg:w-48 flex-shrink-0">
                        {report.image ? (
                          <img
                            src={`${SERVER_URL}/uploads/${report.image}`}
                            alt="Road Damage"
                            className="w-full h-32 object-cover rounded-lg border border-[#454B52]"
                          />
                        ) : (
                          <div className="w-full h-32 rounded-lg bg-[#343A40] border border-[#454B52] flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="text-2xl mb-1">🛣️</div>
                              <p className="text-xs">No image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
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

                            <p className="text-sm text-gray-400 mt-1">
                              <span className="text-amber-400">📍</span>{" "}
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

                        {/* PRIORITY SCORE */}
                        <div className="mt-3 p-3 rounded-lg bg-[#1F2328] border border-[#3A3F45]">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Road Damage Priority Score
                              </p>

                              <PriorityBadge report={report} />
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xs text-gray-500 mb-1">
                                Priority Level
                              </p>

                              <span className={`text-sm font-bold ${priority.color}`}>
                                {priority.label}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-[#3A3F45] rounded-full mt-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${priority.bar}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        {/* ESTIMATED REPAIR TIME */}
                        <div className="mt-3 p-3 rounded-lg bg-[#1F2328] border border-[#3A3F45]">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                🛠️ Smart Repair Time Tracking
                              </p>

                              <p className="text-sm font-semibold text-white">
                                Estimated Repair:{" "}
                                {report.estimatedRepairDays != null
                                  ? `${report.estimatedRepairDays} days`
                                  : "Not available"}
                              </p>

                              <p className="text-sm text-gray-300 mt-1">
                                Original Estimate:{" "}
                                {formatDate(report.originalEstimatedDate)}
                              </p>

                              <p className="text-sm text-gray-300 mt-1">
                                Current Expected Completion:{" "}
                                {formatDate(report.estimatedCompletionDate)}
                              </p>

                              {report.actualCompletionDate && (
                                <p className="text-sm text-emerald-400 mt-1">
                                  Actual Completion:{" "}
                                  {formatDate(report.actualCompletionDate)}
                                </p>
                              )}
                            </div>

                            <span
                              className={`w-fit px-3 py-1.5 rounded-full text-xs font-bold ${tracking.style}`}
                            >
                              {tracking.label}
                            </span>
                          </div>

                          {report.delayReason && (
                            <div className="mt-3 border-t border-[#3A3F45] pt-2">
                              <p className="text-xs text-gray-500">
                                Delay / Revision Reason
                              </p>

                              <p className="text-sm text-gray-300 mt-1">
                                {report.delayReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* REPORT DETAILS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-4">
                          <DetailItem
                            label="Reporter"
                            value={report.name}
                          />

                          <DetailItem
                            label="Phone"
                            value={report.phone}
                          />

                          <DetailItem
                            label="Submitted"
                            value={
                              report.createdAt
                                ? new Date(report.createdAt).toLocaleString()
                                : "N/A"
                            }
                          />

                          <DetailItem
                            label="Coordinates"
                            value={`${report.latitude ?? "N/A"}, ${
                              report.longitude ?? "N/A"
                            }`}
                          />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Description
                          </p>

                          <p className="text-sm text-gray-300 leading-relaxed">
                            {report.description}
                          </p>
                        </div>

                        {/* RESOLUTION NOTE */}
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

                        {/* ACTIONS */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => openStatusUpdate(report)}
                            className="bg-[#3A3F45] hover:bg-[#4A5057] text-white border border-[#50565D] px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                          >
                            Update Status / Estimate
                          </button>

                          <button
                            onClick={() => deleteReport(report._id)}
                            className="bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          UPDATE STATUS / ESTIMATE MODAL
      =================================================== */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="bg-[#292D32] w-full max-w-lg rounded-2xl shadow-2xl p-5 border border-[#454B52] my-auto">
            {/* MODAL HEADER */}
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
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-[#343A40] text-gray-400 hover:bg-[#454B52] hover:text-white text-xl leading-none transition"
              >
                ×
              </button>
            </div>

            {/* CURRENT PRIORITY */}
            <div className="mb-4 rounded-lg bg-[#1F2328] border border-[#3A3F45] p-3">
              <p className="text-xs text-gray-500 mb-1">
                Current Priority Score
              </p>

              <PriorityBadge report={selectedReport} />
            </div>

            {/* CURRENT REPAIR ESTIMATE */}
            <div className="mb-4 rounded-lg bg-[#1F2328] border border-[#3A3F45] p-3">
              <p className="text-xs text-gray-500 mb-1">
                Current Expected Completion
              </p>

              <p className="text-sm font-semibold text-white">
                {formatDate(selectedReport.estimatedCompletionDate)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Original Estimate:{" "}
                {formatDate(selectedReport.originalEstimatedDate)}
              </p>

              {selectedReport.actualCompletionDate && (
                <p className="text-xs text-emerald-400 mt-1">
                  Completed:{" "}
                  {formatDate(selectedReport.actualCompletionDate)}
                </p>
              )}
            </div>

            {/* STATUS */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Report Status
              </label>

              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full border border-[#50565D] bg-[#1F2328] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* REVISE ESTIMATE */}
            {selectedStatus !== "Resolved" && (
              <div className="mb-4 rounded-lg border border-[#454B52] bg-[#24282D] p-3">
                <h3 className="text-sm font-bold text-white mb-1">
                  🗓️ Revise Estimated Completion
                </h3>

                <p className="text-xs text-gray-400 mb-3">
                  Leave blank to keep the current estimate. A revised date
                  must be in the future.
                </p>

                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Revised Completion Date
                </label>

                <input
                  type="date"
                  min={toDateInputValue(new Date(Date.now() + 86400000))}
                  value={revisedEstimatedDate}
                  onChange={(e) => setRevisedEstimatedDate(e.target.value)}
                  className="w-full border border-[#50565D] bg-[#1F2328] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                {revisedEstimatedDate && (
                  <>
                    <label className="block text-xs font-semibold text-gray-300 mt-3 mb-1">
                      Reason for Delay / Revision
                    </label>

                    <textarea
                      rows="3"
                      value={delayReason}
                      onChange={(e) => setDelayReason(e.target.value)}
                      placeholder="e.g. Heavy rainfall, material shortage, contractor delay..."
                      className="w-full border border-[#50565D] bg-[#1F2328] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
                    />
                  </>
                )}
              </div>
            )}

            {/* RESOLUTION NOTE */}
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
                  This note is automatically generated based on the damage
                  type. The actual completion date will be recorded when
                  you save.
                </p>
              </div>
            )}

            {/* MODAL BUTTONS */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex-1 border border-[#50565D] hover:bg-[#343A40] text-gray-300 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                disabled={saving}
                className="flex-1 bg-[#F4B400] hover:bg-[#D99A00] text-[#1F2328] py-2.5 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// =====================================================
// REUSABLE STAT CARD
// =====================================================
function StatCard({ title, value, icon, valueColor }) {
  return (
    <div className="bg-[#292D32] rounded-xl border border-[#3A3F45] shadow-sm p-4 hover:bg-[#2D3238] transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
            {title}
          </p>

          <p className={`text-2xl font-bold mt-1 ${valueColor}`}>
            {value}
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-[#343A40] border border-[#454B52] flex items-center justify-center text-base">
          {icon}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// REUSABLE PRIORITY COUNT
// =====================================================
function PriorityCount({ label, count, color, bg }) {
  return (
    <div className={`rounded-lg border p-3 ${bg}`}>
      <p className="text-xs text-gray-400 font-semibold">
        {label} Priority
      </p>

      <p className={`text-2xl font-bold mt-1 ${color}`}>
        {count}
      </p>
    </div>
  );
}

// =====================================================
// REUSABLE DETAIL ITEM
// =====================================================
function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="font-semibold text-gray-200 text-sm mt-0.5 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default AdminDashboard;