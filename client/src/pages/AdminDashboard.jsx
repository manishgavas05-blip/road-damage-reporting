import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Analytics from "../components/admin/Analytics";
import MapComponent from "../components/MapComponent";
import ReportDetailsModal from "../components/admin/ReportDetailsModal";

function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [damageFilter, setDamageFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  // ==========================================
  // AUTH CONFIG
  // ==========================================
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // HANDLE AUTH ERROR
  // ==========================================
  const handleAuthError = (error) => {
    console.error("Admin authentication error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Your session has expired. Please login again.");

      navigate("/login");
      return true;
    }

    if (error.response?.status === 403) {
      alert("Admin access required.");
      navigate("/");
      return true;
    }

    return false;
  };

  // ==========================================
  // FETCH REPORTS + STATISTICS
  // ==========================================
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        alert("Please login as an administrator.");
        navigate("/login");
        return;
      }

      const config = getAuthConfig();

      /*
       IMPORTANT:
       Both requests now receive the Authorization token.
      */
      const [reportsRes, statsRes] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/reports",
          config
        ),

        axios.get(
          "http://localhost:5000/api/reports/stats",
          config
        ),
      ]);

      // ==========================================
      // REPORTS
      // ==========================================
      const reportsData = reportsRes.data?.reports || [];

      setReports(reportsData);

      // ==========================================
      // STATISTICS
      // ==========================================
      setStats({
        total: statsRes.data?.total || 0,
        pending: statsRes.data?.pending || 0,
        inProgress: statsRes.data?.inProgress || 0,
        resolved: statsRes.data?.resolved || 0,
      });

    } catch (error) {
      console.error(
        "Error fetching admin dashboard:",
        error
      );

      const authError = handleAuthError(error);

      if (!authError) {
        alert(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE REPORT STATUS
  // ==========================================
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const config = getAuthConfig();

      await axios.put(
        `http://localhost:5000/api/reports/${id}`,
        {
          status,
        },
        config
      );

      alert("Status Updated Successfully");

      // Reload reports and statistics
      await fetchReports();

    } catch (error) {
      console.error(
        "Error updating report status:",
        error
      );

      const authError = handleAuthError(error);

      if (!authError) {
        alert(
          error.response?.data?.message ||
            "Failed to update status."
        );
      }
    }
  };

  // ==========================================
  // DELETE REPORT
  // ==========================================
  const deleteReport = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const config = getAuthConfig();

      await axios.delete(
        `http://localhost:5000/api/reports/${id}`,
        config
      );

      alert("Report Deleted Successfully");

      // Close modal if deleted report was open
      if (selectedReport?._id === id) {
        setSelectedReport(null);
      }

      // Reload reports and statistics
      await fetchReports();

    } catch (error) {
      console.error(
        "Error deleting report:",
        error
      );

      const authError = handleAuthError(error);

      if (!authError) {
        alert(
          error.response?.data?.message ||
            "Failed to delete report."
        );
      }
    }
  };

  // ==========================================
  // FILTER REPORTS
  // ==========================================
  const filteredReports = reports.filter((report) => {
    const reportName = report.name || "";
    const reportLocation = report.location || "";
    const reportDamageType = report.damageType || "";

    const matchesSearch = reportName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      report.status === statusFilter;

    const matchesDamage =
      damageFilter === "All" ||
      reportDamageType === damageFilter;

    const matchesLocation = reportLocation
      .toLowerCase()
      .includes(locationFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDamage &&
      matchesLocation
    );
  });

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            ⏳
          </div>

          <h2 className="text-2xl font-bold text-blue-700">
            Loading Admin Dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching reports and statistics.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* =====================================
            PAGE TITLE
        ====================================== */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Admin Dashboard
        </h1>

        {/* =====================================
            STATISTICS
        ====================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          {/* TOTAL */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">
              📋
            </div>

            <h3 className="text-gray-500 font-semibold">
              Total Reports
            </h3>

            <p className="text-4xl font-bold text-blue-700 mt-2">
              {stats.total}
            </p>
          </div>

          {/* PENDING */}
          <div className="bg-yellow-100 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">
              🟡
            </div>

            <h3 className="text-yellow-700 font-semibold">
              Pending
            </h3>

            <p className="text-4xl font-bold text-yellow-700 mt-2">
              {stats.pending}
            </p>
          </div>

          {/* IN PROGRESS */}
          <div className="bg-blue-100 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">
              🔵
            </div>

            <h3 className="text-blue-700 font-semibold">
              In Progress
            </h3>

            <p className="text-4xl font-bold text-blue-700 mt-2">
              {stats.inProgress}
            </p>
          </div>

          {/* RESOLVED */}
          <div className="bg-green-100 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">
              🟢
            </div>

            <h3 className="text-green-700 font-semibold">
              Resolved
            </h3>

            <p className="text-4xl font-bold text-green-700 mt-2">
              {stats.resolved}
            </p>
          </div>

        </div>

        {/* =====================================
            ANALYTICS
        ====================================== */}
        <Analytics stats={stats} />

        {/* =====================================
            LIVE MAP
        ====================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🗺️ Live Road Damage Map
          </h2>

          <MapComponent />

        </div>

        {/* =====================================
            SEARCH & FILTERS
        ====================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6 my-8">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search & Filter Reports
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            {/* SEARCH NAME */}
            <input
              type="text"
              placeholder="🔍 Search by Name"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Status
              </option>

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

            {/* DAMAGE TYPE */}
            <select
              value={damageFilter}
              onChange={(e) =>
                setDamageFilter(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Damage Types
              </option>

              <option value="Pothole">
                Pothole
              </option>

              <option value="Road Crack">
                Road Crack
              </option>

              <option value="Broken Road">
                Broken Road
              </option>

              <option value="Water Logging">
                Water Logging
              </option>

              <option value="Street Light Damage">
                Street Light Damage
              </option>
            </select>

            {/* LOCATION */}
            <input
              type="text"
              placeholder="📍 Search Location"
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
        </div>

        {/* =====================================
            REPORT COUNT
        ====================================== */}
        <div className="mb-4 text-gray-600">
          Showing{" "}
          <strong>
            {filteredReports.length}
          </strong>{" "}
          of{" "}
          <strong>
            {reports.length}
          </strong>{" "}
          reports
        </div>

        {/* =====================================
            REPORTS TABLE
        ====================================== */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

          <table className="w-full">

            <thead className="bg-blue-700 text-white">

              <tr>

                <th className="p-4">
                  Image
                </th>

                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Location
                </th>

                <th className="p-4">
                  Damage
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.map((report) => (

                <tr
                  key={report._id}
                  className="border-b hover:bg-gray-50 text-center"
                >

                  {/* IMAGE */}
                  <td className="p-4">

                    {report.image ? (

                      <img
                        src={`http://localhost:5000/uploads/${report.image}`}
                        alt="Road Damage"
                        className="w-24 h-20 object-cover rounded-lg border mx-auto"
                      />

                    ) : (

                      <span className="text-gray-400">
                        No Image
                      </span>

                    )}

                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium">
                    {report.name || "N/A"}
                  </td>

                  {/* LOCATION */}
                  <td className="p-4">
                    {report.location || "N/A"}
                  </td>

                  {/* DAMAGE */}
                  <td className="p-4">
                    {report.damageType || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    <select
                      value={
                        report.status || "Pending"
                      }
                      onChange={(e) =>
                        updateStatus(
                          report._id,
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-2"
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

                  </td>

                  {/* DATE */}
                  <td className="p-4">

                    {report.createdAt
                      ? new Date(
                          report.createdAt
                        ).toLocaleDateString()
                      : "N/A"}

                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">

                    <div className="flex flex-col gap-2 items-center">

                      <button
                        onClick={() =>
                          setSelectedReport(report)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          deleteReport(report._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {/* NO REPORTS */}
              {filteredReports.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-10 text-gray-500"
                  >

                    <div className="text-4xl mb-3">
                      📭
                    </div>

                    <p className="text-lg font-semibold">
                      No reports found.
                    </p>

                    <p className="text-sm mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          REPORT DETAILS MODAL
      ====================================== */}
      <ReportDetailsModal
        report={selectedReport}
        onClose={() =>
          setSelectedReport(null)
        }
      />

    </section>
  );
}

export default AdminDashboard;