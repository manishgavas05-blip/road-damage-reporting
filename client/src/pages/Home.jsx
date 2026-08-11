import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import LatestReports from "../components/home/LatestReports";
import MapComponent from "../components/MapComponent";

function Home() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // =====================================================
  // FETCH RECENT ACTIVITY
  // =====================================================
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reports/recent-activity",
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setActivities(data.activities || []);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivity();
  }, [token]);

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // ACTIVITY ICON
  // =====================================================
  const getActivityIcon = (type) => {
    switch (type) {
      case "resolved":
        return "✓";

      case "in-progress":
        return "↻";

      case "pending":
        return "⏳";

      default:
        return "•";
    }
  };

  // =====================================================
  // ACTIVITY ICON STYLE
  // =====================================================
  const getActivityIconStyle = (type) => {
    switch (type) {
      case "resolved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

      case "in-progress":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";

      case "pending":
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";

      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";

      case "Pending":
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";

      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2933] text-white">

      {/* =================================================
          HERO
      ================================================= */}
      <Hero />

      {/* =================================================
          LOGGED-IN USER QUICK ACTIONS
      ================================================= */}
      {token && user && user.role !== "admin" && (
        <section className="max-w-7xl mx-auto px-4 pt-7">

          <div className="bg-[#252B31] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700 shadow-sm">

            <div>

              <div className="flex items-center gap-2">

                <span className="w-1 h-6 bg-[#F4B400] rounded-full"></span>

                <h2 className="text-xl font-bold text-white">
                  Welcome back, {user.name}! 👋
                </h2>

              </div>

              <p className="text-slate-400 text-sm mt-1.5 ml-3">
                Track your reports or submit a new road damage report.
              </p>

            </div>

            <div className="flex flex-wrap gap-3 justify-center">

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="bg-[#454A4F] hover:bg-[#555B61] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                📊 Dashboard
              </Link>

              {/* My Reports */}
              <Link
                to="/my-reports"
                className="bg-transparent hover:bg-white/10 text-white border border-slate-500 px-5 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                📋 My Reports
              </Link>

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          ROAD DAMAGE MAP
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        <div className="text-center mb-6">

          <p className="text-[#F4B400] font-bold uppercase tracking-[0.18em] text-xs">
            Live Road Monitoring
          </p>

          <h2 className="text-3xl font-bold text-white mt-1.5">
            Road Damage Map
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            View reported road damage locations across the area.
          </p>

        </div>

        {/* Map Container */}
        <div className="bg-[#252B31] border border-slate-700 rounded-xl p-2 shadow-sm overflow-hidden">
          <MapComponent />
        </div>

      </section>

      {/* =================================================
          RECENT ACTIVITY
      ================================================= */}
      <section className="bg-[#252B31] border-y border-slate-700 py-10">

        <div className="max-w-5xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-6">

            <p className="text-[#F4B400] font-bold uppercase tracking-[0.18em] text-xs">
              System Updates
            </p>

            <h2 className="text-3xl font-bold text-white mt-1.5">
              Recent Activity
            </h2>

            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Stay updated with the latest changes and progress on reported
              road damage.
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}
          {loadingActivities ? (

            <div className="bg-[#1F2933] rounded-xl border border-slate-700 p-6 text-center shadow-sm">

              <div className="inline-flex items-center gap-2.5 text-slate-400 text-sm">

                <div className="w-4 h-4 border-2 border-slate-600 border-t-[#F4B400] rounded-full animate-spin"></div>

                <span>
                  Loading recent activity...
                </span>

              </div>

            </div>

          ) : activities.length === 0 ? (

            /* =================================================
                NO ACTIVITY
            ================================================= */
            <div className="bg-[#1F2933] rounded-xl border border-slate-700 p-7 text-center shadow-sm">

              <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-[#30373D] border border-slate-600 flex items-center justify-center text-lg">
                📋
              </div>

              <h3 className="text-base font-semibold text-white">
                No recent activity
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                There are no recent report updates to display.
              </p>

            </div>

          ) : (

            /* =================================================
                ACTIVITY LIST
            ================================================= */
            <div className="max-w-4xl mx-auto space-y-3">

              {activities.slice(0, 5).map((activity) => (

                <div
                  key={activity.id}
                  className="bg-[#1F2933] border border-slate-700 rounded-xl px-4 py-3.5 shadow-sm hover:border-slate-500 transition duration-200"
                >

                  <div className="flex items-center gap-3.5">

                    {/* Activity Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${getActivityIconStyle(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">

                      {/* Title + Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">

                        <h3 className="font-semibold text-white text-base">
                          {activity.title || "Report update"}
                        </h3>

                        {activity.status && (
                          <span
                            className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              activity.status
                            )}`}
                          >
                            {activity.status}
                          </span>
                        )}

                      </div>

                      {/* Report Information */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">

                        {activity.damageType && (
                          <span className="flex items-center gap-1">
                            <span>🛣️</span>
                            <span>{activity.damageType}</span>
                          </span>
                        )}

                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{activity.location}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1">
                          <span>🕒</span>

                          <span>
                            {formatDate(
                              activity.updatedAt || activity.createdAt
                            )}
                          </span>
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* =================================================
              VIEW REPORTS BUTTON
          ================================================= */}
          {activities.length > 0 && (

            <div className="text-center mt-6">

              <Link
                to="/my-reports"
                className="inline-flex items-center gap-2 bg-[#454A4F] hover:bg-[#555B61] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                View My Reports
                <span>→</span>
              </Link>

            </div>

          )}

        </div>

      </section>

      {/* =================================================
          FEATURES
      ================================================= */}
      <section className="bg-[#1F2933]">
        <Features />
      </section>

      {/* =================================================
          LATEST REPORTS
      ================================================= */}
      <section className="bg-[#252B31] border-t border-slate-700">
        <LatestReports />
      </section>

    </div>
  );
}

export default Home;