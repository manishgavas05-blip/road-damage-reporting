import { useEffect, useState } from "react";
import axios from "axios";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH USER REPORTS
  // ===============================
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reports/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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
  // RESOLUTION NOTES
  // ===============================
  const getResolutionNote = (damageType) => {
    switch (damageType) {
      case "Pothole":
        return "Pothole repaired and the damaged road surface has been restored.";

      case "Road Crack":
        return "Road cracks have been repaired and the damaged surface has been restored.";

      case "Broken Road":
        return "The damaged road section has been repaired and restored for safe use.";

      case "Water Logging":
        return "Water logging issue has been addressed and proper drainage has been restored.";

      case "Street Light Damage":
        return "The damaged street light has been repaired and normal operation has been restored.";

      default:
        return "The reported road damage has been inspected and resolved.";
    }
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ===============================
  // IMAGE URL
  // ===============================
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/uploads/${image}`;
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-center items-center py-16">
            <p className="text-blue-700 text-base font-semibold">
              Loading your reports...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ===============================
  // PAGE
  // ===============================
  return (
    <section className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-5">

        {/* ===============================
            PAGE HEADER
        =============================== */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            My Reports
          </h1>

          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Track the road damage reports you have submitted.
          </p>
        </div>

        {/* ===============================
            REPORTS CONTAINER
        =============================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* SECTION HEADER */}
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Your Road Damage Reports
            </h2>

            <p className="text-gray-500 mt-1 text-sm">
              View the details and current status of every report.
            </p>
          </div>

          {/* ===============================
              EMPTY STATE
          =============================== */}
          {reports.length === 0 ? (
            <div className="text-center py-16 px-5">
              <div className="text-4xl mb-3">📋</div>

              <h3 className="text-lg font-semibold text-gray-700">
                No reports yet
              </h3>

              <p className="text-gray-500 mt-1 text-sm">
                You haven't submitted any road damage reports.
              </p>
            </div>
          ) : (
            <div>

              {/* ===============================
                  REPORT LIST
              =============================== */}
              {reports.map((report) => {
                const imageUrl = getImageUrl(report.image);

                return (
                  <div
                    key={report._id}
                    className="
                      px-5 py-5
                      border-b border-gray-200
                      last:border-b-0
                      hover:bg-gray-50
                      transition
                    "
                  >

                    {/* ===============================
                        MAIN REPORT ROW
                    =============================== */}
                    <div className="flex flex-col lg:flex-row gap-5">

                      {/* ===============================
                          IMAGE
                      =============================== */}
                      <div
                        className="
                          w-full
                          lg:w-[230px]
                          h-[150px]
                          flex-shrink-0
                          bg-gray-100
                          rounded-lg
                          overflow-hidden
                        "
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={report.damageType}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="text-3xl mb-1">
                              🛣️
                            </div>

                            <span className="text-xs">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ===============================
                          REPORT INFORMATION
                      =============================== */}
                      <div className="flex-1 min-w-0">

                        {/* TITLE + STATUS */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                          <div>
                            <h3 className="text-xl font-bold text-blue-700">
                              {report.damageType}
                            </h3>

                            <p className="text-gray-600 mt-1 text-sm">
                              📍 {report.location || "Location unavailable"}
                            </p>
                          </div>

                          <span
                            className={`
                              inline-flex
                              w-fit
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-semibold
                              ${getStatusStyle(report.status)}
                            `}
                          >
                            {report.status}
                          </span>

                        </div>

                        {/* ===============================
                            DETAILS GRID
                        =============================== */}
                        <div
                          className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-4
                            gap-x-6
                            gap-y-4
                            mt-4
                          "
                        >

                          {/* REPORTER */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Reporter
                            </p>

                            <p className="font-semibold text-gray-800 mt-1 text-sm">
                              {report.name || "N/A"}
                            </p>
                          </div>

                          {/* PHONE */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Phone
                            </p>

                            <p className="font-semibold text-gray-800 mt-1 text-sm">
                              {report.phone || "N/A"}
                            </p>
                          </div>

                          {/* SUBMITTED */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Submitted
                            </p>

                            <p className="font-semibold text-gray-800 mt-1 text-sm">
                              {formatDate(report.createdAt)}
                            </p>
                          </div>

                          {/* COORDINATES */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Coordinates
                            </p>

                            <p className="font-semibold text-gray-800 mt-1 text-sm">
                              {report.latitude != null &&
                              report.longitude != null
                                ? `${Number(report.latitude).toFixed(
                                    6
                                  )}, ${Number(report.longitude).toFixed(
                                    6
                                  )}`
                                : "N/A"}
                            </p>
                          </div>

                        </div>

                        {/* ===============================
                            DESCRIPTION
                        =============================== */}
                        <div className="mt-4">
                          <p className="text-xs text-gray-500">
                            Description
                          </p>

                          <p className="text-gray-700 mt-1 text-sm">
                            {report.description ||
                              "No description provided."}
                          </p>
                        </div>

                        {/* ===============================
                            RESOLUTION NOTE
                        =============================== */}
                        {report.status === "Resolved" && (
                          <div
                            className="
                              mt-4
                              bg-green-50
                              border
                              border-green-200
                              rounded-lg
                              px-4
                              py-3
                            "
                          >
                            <p className="font-semibold text-green-700 text-xs">
                              Resolution Note
                            </p>

                            <p className="text-green-700 mt-1 text-sm">
                              {report.resolutionNote ||
                                getResolutionNote(report.damageType)}
                            </p>
                          </div>
                        )}

                        {/* ===============================
                            FOOTER
                        =============================== */}
                        <div
                          className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                            mt-4
                            pt-4
                            border-t
                            border-gray-200
                          "
                        >

                          <p className="text-xs text-gray-500">
                            Report ID:{" "}
                            <span className="font-medium text-gray-700">
                              {report._id}
                            </span>
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/report/${report._id}`;
                            }}
                            className="
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              font-semibold
                              text-sm
                              px-4
                              py-2
                              rounded-lg
                              transition
                              w-fit
                            "
                          >
                            View Details →
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
    </section>
  );
}

export default MyReports;