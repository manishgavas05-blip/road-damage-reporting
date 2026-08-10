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
  // FIXED RESOLUTION NOTES
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

    // If already resolved, show its saved note.
    // Otherwise automatically prepare the fixed note.
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

    // Resolution requires a note
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

      // Close modal
      setSelectedReport(null);
      setSelectedStatus("");
      setResolutionNote("");

      // Reload reports and statistics
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
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>

            <p className="text-xl font-semibold text-gray-700">
              Loading Admin Dashboard...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Manage road damage reports and update their status.
          </p>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  Total Reports
                </p>

                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {stats.total}
                </p>
              </div>

              <div className="text-3xl">
                📋
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  Pending
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.pending}
                </p>
              </div>

              <div className="text-3xl">
                🟡
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  In Progress
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.inProgress}
                </p>
              </div>

              <div className="text-3xl">
                🔵
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  Resolved
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.resolved}
                </p>
              </div>

              <div className="text-3xl">
                🟢
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            REPORTS
        ================================================= */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              All Reports
            </h2>

            <p className="text-gray-500 mt-1">
              Review and manage submitted road damage reports.
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">
                📭
              </div>

              <h3 className="text-xl font-semibold text-gray-700">
                No Reports Found
              </h3>

              <p className="text-gray-500 mt-2">
                There are currently no road damage reports.
              </p>
            </div>
          ) : (
            <div className="divide-y">

              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-6 hover:bg-gray-50 transition"
                >

                  <div className="flex flex-col lg:flex-row gap-6">

                    {/* IMAGE */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                      {report.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${report.image}`}
                          alt="Road Damage"
                          className="w-full h-44 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-44 rounded-xl bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-4xl mb-2">
                              🛣️
                            </div>

                            <p className="text-sm">
                              No image
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                        <div>
                          <h3 className="text-xl font-bold text-blue-700">
                            {report.damageType}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            📍 {report.location}
                          </p>
                        </div>

                        <span
                          className={`w-fit px-4 py-2 rounded-full font-semibold text-sm ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {report.status || "Pending"}
                        </span>
                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                        <div>
                          <p className="text-sm text-gray-500">
                            Reporter
                          </p>

                          <p className="font-semibold text-gray-800">
                            {report.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Phone
                          </p>

                          <p className="font-semibold text-gray-800">
                            {report.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Submitted
                          </p>

                          <p className="font-semibold text-gray-800">
                            {report.createdAt
                              ? new Date(
                                  report.createdAt
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Coordinates
                          </p>

                          <p className="font-semibold text-gray-800">
                            {report.latitude},{" "}
                            {report.longitude}
                          </p>
                        </div>

                      </div>

                      {/* DESCRIPTION */}
                      <div className="mt-5">
                        <p className="text-sm text-gray-500 mb-1">
                          Description
                        </p>

                        <p className="text-gray-700">
                          {report.description}
                        </p>
                      </div>

                      {/* RESOLUTION NOTE */}
                      {report.status === "Resolved" &&
                        report.resolutionNote && (
                          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-green-700 mb-1">
                              Resolution Note
                            </p>

                            <p className="text-green-800">
                              {report.resolutionNote}
                            </p>
                          </div>
                        )}

                      {/* ACTIONS */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">

                        <button
                          onClick={() =>
                            openStatusUpdate(report)
                          }
                          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                        >
                          Update Status
                        </button>

                        <button
                          onClick={() =>
                            deleteReport(report._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Update Report
                </h2>

                <p className="text-gray-500 mt-1">
                  {selectedReport.damageType}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setResolutionNote("");
                }}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Status */}
            <div className="mb-5">

              <label className="block font-semibold text-gray-700 mb-2">
                Report Status
              </label>

              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="mb-5">

                <label className="block font-semibold text-gray-700 mb-2">
                  Resolution Note
                </label>

                <textarea
                  value={resolutionNote}
                  readOnly
                  rows="4"
                  className="w-full border border-green-300 bg-green-50 text-green-800 rounded-xl px-4 py-3 focus:outline-none resize-none"
                />

                <p className="text-xs text-gray-500 mt-2">
                  This note is automatically generated based on the damage type.
                </p>

              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedStatus("");
                  setResolutionNote("");
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition"
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