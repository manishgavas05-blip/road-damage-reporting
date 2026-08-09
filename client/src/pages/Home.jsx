import { Link } from "react-router-dom";

import Hero from "../components/home/Hero";
import Statistics from "../components/home/Statistics";
import Features from "../components/home/Features";
import LatestReports from "../components/home/LatestReports";
import MapComponent from "../components/MapComponent";

function Home() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Logged-in User Quick Actions */}
      {token && user && user.role !== "admin" && (
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <div className="bg-blue-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

            <div>
              <h2 className="text-2xl font-bold text-blue-700">
                Welcome back, {user.name}! 👋
              </h2>

              <p className="text-gray-600 mt-1">
                Track your reports or submit a new road damage report.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                📊 Dashboard
              </Link>

              {/* My Reports */}
              <Link
                to="/my-reports"
                className="bg-white hover:bg-gray-100 text-blue-700 border border-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                📋 My Reports
              </Link>

            </div>

          </div>
        </section>
      )}

      {/* Road Damage Map */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Road Damage Map
        </h2>

        <MapComponent />

      </section>

      {/* Statistics */}
      <Statistics />

      {/* Features */}
      <Features />

      {/* Latest Reports */}
      <LatestReports />

    </>
  );
}

export default Home;