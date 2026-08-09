import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <section className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="text-6xl mb-4">👤</div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Profile Not Found
            </h1>

            <p className="text-gray-500 mb-6">
              Please log in again to view your profile.
            </p>

            <Link
              to="/login"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">👤</div>

          <h1 className="text-4xl font-bold text-blue-700">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            View your account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">

              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-white text-blue-700 flex items-center justify-center text-5xl font-bold shadow-lg">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">
                  {user.name || "User"}
                </h2>

                <p className="text-blue-100 mt-2">
                  {user.email || "No email available"}
                </p>

                <span className="inline-block mt-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                  {user.role === "admin" ? "Administrator" : "User"}
                </span>
              </div>

            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="bg-gray-50 rounded-xl p-5 border">
                <p className="text-sm text-gray-500 mb-2">
                  Full Name
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {user.name || "Not available"}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-5 border">
                <p className="text-sm text-gray-500 mb-2">
                  Email Address
                </p>

                <p className="text-lg font-semibold text-gray-800 break-all">
                  {user.email || "Not available"}
                </p>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-xl p-5 border">
                <p className="text-sm text-gray-500 mb-2">
                  Account Type
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {user.role === "admin" ? "Administrator" : "Normal User"}
                </p>
              </div>

              {/* User ID */}
              <div className="bg-gray-50 rounded-xl p-5 border">
                <p className="text-sm text-gray-500 mb-2">
                  User ID
                </p>

                <p className="text-sm font-mono text-gray-700 break-all">
                  {user._id || user.id || "Not available"}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">

              <Link
                to="/dashboard"
                className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                📊 Dashboard
              </Link>

              <Link
                to="/my-reports"
                className="flex-1 text-center border-2 border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition"
              >
                📋 My Reports
              </Link>

              <Link
                to="/report"
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                🚧 Report Damage
              </Link>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Profile;