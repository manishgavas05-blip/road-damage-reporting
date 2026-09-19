import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// =====================================================
// PRIORITY SCORE
// Keep scoring consistent with Admin Dashboard & Map
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

  if (report.createdAt) {
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
      badge: "bg-red-500/10 text-red-400 border-red-500/30",
      bar: "bg-red-500",
    };
  }

  if (score >= 60) {
    return {
      label: "High",
      badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      bar: "bg-orange-500",
    };
  }

  if (score >= 35) {
    return {
      label: "Medium",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      bar: "bg-amber-400",
    };
  }

  return {
    label: "Low",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    bar: "bg-emerald-500",
  };
};

// =====================================================
// COMMUNITY REPORTS
// =====================================================
function CommunityReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByPriority, setSortByPriority] = useState(true);

  // =====================================================
  // FETCH COMMUNITY REPORTS
  // =====================================================
  const fetchCommunityReports = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/reports/community",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReports(response.data.reports || []);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching community reports:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityReports();
  }, []);

  // =====================================================
  // SORT REPORTS
  // =====================================================
  const sortedReports = useMemo(() => {
    const list = [...reports];

    if (sortByPriority) {
      list.sort(
        (a, b) => calculatePriority(b) - calculatePriority(a)
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return list;
  }, [reports, sortByPriority]);

  // =====================================================
  // PRIORITY COUNTS
  // =====================================================
  const priorityCounts = useMemo(() => {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    reports.forEach((report) => {
      const priority = getPriority(calculatePriority(report));
      counts[priority.label]++;
    });

    return counts;
  }, [reports]);

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";

      case "Pending":
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/20";
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
        return "•";
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // IMAGE URL
  // =====================================================
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/uploads/${image}`;
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="min-h-screen bg-[#252B30] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-11 h-11 mx-auto border-4 border-[#454D54] border-t-[#E0A900] rounded-full animate-spin" />

          <p className="text-[#E2E5E7] text-sm font-semibold mt-4">
            Loading community reports...
          </p>

          <p className="text-[#89929A] text-xs mt-1">
            Please wait.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <section className="min-h-screen bg-[#252B30] py-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#343B42] border border-[#4A5259] rounded-full px-3 py-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E0A900]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9CDD1]">
                  Community Activity
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Community Reports
              </h1>

              <p className="text-[#AEB5BB] mt-2 text-sm">
                View community road damage reports and their
                calculated priority levels.
              </p>
            </div>

            <div className="bg-[#343B42] border border-[#4A5259] rounded-xl px-5 py-4 min-w-[145px]">
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#919AA2]">
                Total Reports
              </p>

              <p className="text-2xl font-bold text-[#E0A900] mt-1">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        {/* PRIORITY OVERVIEW */}
        <div className="bg-[#30373E] border border-[#454D54] rounded-xl p-4 mb-6">
          <h2 className="text-white font-bold text-lg mb-1">
            🚦 Priority Overview
          </h2>

          <p className="text-[#AEB5BB] text-xs mb-4">
            Reports grouped by calculated priority score.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Critical",
                color: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              },
              {
                label: "High",
                color: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/20",
              },
              {
                label: "Medium",
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
              },
              {
                label: "Low",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-3 ${item.bg}`}
              >
                <p className="text-xs text-[#AEB5BB] font-semibold">
                  {item.label}
                </p>

                <p className={`text-2xl font-bold mt-1 ${item.color}`}>
                  {priorityCounts[item.label]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* REPORT FEED */}
        <div className="bg-[#30373E] rounded-xl border border-[#454D54] shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">

          {/* SECTION HEADER */}
          <div className="px-5 md:px-6 py-5 border-b border-[#4A5259] bg-[#343B42]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Road Damage Report Feed
                </h2>

                <p className="text-[#AEB5BB] mt-1 text-xs md:text-sm">
                  Review reports submitted by community members.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortByPriority((prev) => !prev)
                }
                className="bg-[#252B30] hover:bg-[#3A4249] text-[#E5E7E9] border border-[#4A5259] rounded-lg px-4 py-2.5 text-xs font-bold transition"
              >
                {sortByPriority
                  ? "🔴 Highest Priority First"
                  : "🕒 Newest Reports First"}
              </button>
            </div>
          </div>

          {/* EMPTY STATE */}
          {reports.length === 0 ? (
            <div className="text-center py-20 px-5 bg-[#30373E]">
              <div className="w-14 h-14 mx-auto rounded-xl bg-[#3A4249] border border-[#4A5259] flex items-center justify-center text-2xl mb-4">
                📋
              </div>

              <h3 className="text-lg font-bold text-white">
                No community reports yet
              </h3>

              <p className="text-[#9AA3AB] mt-1 text-sm">
                No road damage reports have been submitted yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#454D54]">
              {sortedReports.map((report, index) => {
                const imageUrl = getImageUrl(report.image);
                const score = calculatePriority(report);
                const priority = getPriority(score);

                return (
                  <div
                    key={report._id}
                    className="p-5 md:p-6 bg-[#30373E] hover:bg-[#353D44] transition"
                  >
                    <div className="flex flex-col lg:flex-row gap-5">

                      {/* IMAGE */}
                      <div className="w-full lg:w-[230px] h-[155px] flex-shrink-0 bg-[#252B30] rounded-lg overflow-hidden border border-[#4A5259]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={report.damageType || "Road damage"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#7F8991]">
                            <div className="w-11 h-11 rounded-lg bg-[#343B42] border border-[#4A5259] flex items-center justify-center text-xl mb-2">
                              🛣️
                            </div>

                            <span className="text-xs">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* REPORT INFORMATION */}
                      <div className="flex-1 min-w-0">

                        {/* TOP ROW */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#E0A900] tracking-[0.15em]">
                              COMMUNITY REPORT{" "}
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <h3 className="text-xl font-bold text-white mt-1">
                              {report.damageType || "Road Damage"}
                            </h3>

                            <p className="text-[#AEB5BB] mt-1 text-sm">
                              <span className="text-[#E0A900]">📍</span>{" "}
                              {report.location || "Location unavailable"}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(
                              report.status
                            )}`}
                          >
                            <span>{getStatusIcon(report.status)}</span>
                            {report.status || "Pending"}
                          </span>
                        </div>

                        {/* PRIORITY SCORE */}
                        <div className="mt-4 p-3 rounded-lg bg-[#252B30] border border-[#424A51]">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide font-semibold text-[#7F8991] mb-1">
                                Road Damage Priority Score
                              </p>

                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold border ${priority.badge}`}
                                >
                                  {priority.label} Priority
                                </span>

                                <span className="text-sm font-bold text-white">
                                  {score}/100
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-[#9AA3AB]">
                              Priority Level:{" "}
                              <span className="font-bold text-white">
                                {priority.label}
                              </span>
                            </p>
                          </div>

                          <div className="w-full h-2 bg-[#3A4249] rounded-full mt-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${priority.bar}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        {/* REPORT DETAILS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                          <div className="bg-[#252B30] border border-[#424A51] rounded-lg p-3">
                            <p className="text-[10px] uppercase tracking-wide font-semibold text-[#7F8991]">
                              Reported By
                            </p>

                            <p className="font-semibold text-[#E5E7E9] mt-1 text-xs md:text-sm truncate">
                              {report.user?.name || "Community User"}
                            </p>
                          </div>

                          <div className="bg-[#252B30] border border-[#424A51] rounded-lg p-3">
                            <p className="text-[10px] uppercase tracking-wide font-semibold text-[#7F8991]">
                              Submitted
                            </p>

                            <p className="font-semibold text-[#E5E7E9] mt-1 text-xs md:text-sm">
                              {formatDate(report.createdAt)}
                            </p>
                          </div>

                          <div className="bg-[#252B30] border border-[#424A51] rounded-lg p-3">
                            <p className="text-[10px] uppercase tracking-wide font-semibold text-[#7F8991]">
                              Issue Type
                            </p>

                            <p className="font-semibold text-[#E5E7E9] mt-1 text-xs md:text-sm truncate">
                              {report.damageType || "Road Damage"}
                            </p>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-5">
                          <p className="text-[10px] uppercase tracking-wide font-semibold text-[#7F8991]">
                            Description
                          </p>

                          <p className="text-[#C1C7CC] mt-1 text-sm leading-relaxed">
                            {report.description ||
                              "No description provided."}
                          </p>
                        </div>

                        {/* RESOLUTION NOTE */}
                        {report.status === "Resolved" && (
                          <div className="mt-5 bg-[#183D2B] border border-[#276443] rounded-lg px-4 py-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 flex-shrink-0 rounded-md bg-[#245638] text-[#65D391] flex items-center justify-center text-sm font-bold">
                                ✓
                              </div>

                              <div>
                                <p className="font-bold text-[#65D391] text-xs">
                                  Resolution Note
                                </p>

                                <p className="text-[#9BE0B3] mt-1 text-sm leading-relaxed">
                                  {report.resolutionNote ||
                                    "This report has been resolved by the administration team."}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* FOOTER */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-[#454D54]">
                          <p className="text-[11px] text-[#747E87] break-all">
                            Report ID:{" "}
                            <span className="font-medium text-[#9AA3AB]">
                              {report._id}
                            </span>
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/report/${report._id}`)
                            }
                            className="bg-[#E0A900] hover:bg-[#C99600] text-[#252B30] font-bold text-xs px-4 py-2.5 rounded-lg transition w-fit shadow-sm"
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

        {/* FOOTER NOTE */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-[#737D85]">
          <span>🌍</span>

          <span>
            Community reports help everyone stay informed about road conditions.
          </span>
        </div>
      </div>
    </section>
  );
}

export default CommunityReports;