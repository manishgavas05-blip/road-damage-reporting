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

  // =====================================================
  // PROFILE NOT FOUND
  // =====================================================
  if (!user) {
    return (
      <section className="min-h-screen bg-[#F4F5F6] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-xl bg-[#F4F5F6] flex items-center justify-center text-3xl mb-5">
              👤
            </div>

            <h1 className="text-2xl font-bold text-[#1F2933] mb-3">
              Profile Not Found
            </h1>

            <p className="text-[#66727D] mb-6 text-sm">
              Please log in again to view your profile.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center bg-[#1F2933] hover:bg-[#2D3A45] text-white px-6 py-3 rounded-lg font-semibold text-sm transition shadow-sm"
            >
              Go to Login
            </Link>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F4F5F6] py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div className="mb-7">

          <div className="flex flex-col md:flex-row md:items-center gap-4">

            {/* Icon */}
            <div className="w-11 h-11 rounded-lg bg-[#1F2933] flex items-center justify-center shadow-sm">
              <span className="text-[#F4B400] text-lg">
                👤
              </span>
            </div>

            {/* Title */}
            <div>

              <p className="text-[#F4B400] font-bold uppercase tracking-[0.18em] text-xs">
                Account Activity
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2933] mt-1">
                My Profile
              </h1>

            </div>

          </div>

          <p className="text-[#66727D] mt-3 text-sm">
            View your account information and manage your road reporting activity.
          </p>

        </div>


        {/* =====================================================
            PROFILE CARD
        ===================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* =====================================================
              PROFILE HEADER
          ===================================================== */}
          <div className="bg-[#1F2933] px-6 md:px-8 py-8 text-white">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-xl bg-[#2D3A45] border border-[#46525D] flex items-center justify-center text-3xl font-bold text-[#F4B400] shadow-sm flex-shrink-0">

                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}

              </div>


              {/* User Details */}
              <div className="text-center sm:text-left">

                <h2 className="text-2xl font-bold">
                  {user.name || "User"}
                </h2>

                <p className="text-slate-300 mt-1 text-sm break-all">
                  {user.email || "No email available"}
                </p>

                <span className="inline-flex items-center mt-3 bg-[#F4B400]/15 border border-[#F4B400]/30 text-[#F4B400] px-3 py-1.5 rounded-full text-xs font-bold">

                  {user.role === "admin"
                    ? "Administrator"
                    : "Registered User"}

                </span>

              </div>

            </div>

          </div>


          {/* =====================================================
              PROFILE INFORMATION
          ===================================================== */}
          <div className="p-6 md:p-8">

            {/* Section Title */}
            <div className="flex items-center gap-2 mb-5">

              <span className="w-1.5 h-5 rounded-full bg-[#F4B400]" />

              <h3 className="text-lg font-bold text-[#1F2933]">
                Account Information
              </h3>

            </div>


            {/* =====================================================
                INFORMATION GRID
            ===================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Full Name */}
              <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">

                <p className="text-[10px] uppercase tracking-wide font-semibold text-[#A0A8AF]">
                  Full Name
                </p>

                <p className="text-sm font-semibold text-[#1F2933] mt-1">
                  {user.name || "Not available"}
                </p>

              </div>


              {/* Email */}
              <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">

                <p className="text-[10px] uppercase tracking-wide font-semibold text-[#A0A8AF]">
                  Email Address
                </p>

                <p className="text-sm font-semibold text-[#1F2933] mt-1 break-all">
                  {user.email || "Not available"}
                </p>

              </div>


              {/* Account Type */}
              <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">

                <p className="text-[10px] uppercase tracking-wide font-semibold text-[#A0A8AF]">
                  Account Type
                </p>

                <p className="text-sm font-semibold text-[#1F2933] mt-1">
                  {user.role === "admin"
                    ? "Administrator"
                    : "Normal User"}
                </p>

              </div>


              {/* User ID */}
              <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">

                <p className="text-[10px] uppercase tracking-wide font-semibold text-[#A0A8AF]">
                  User ID
                </p>

                <p className="text-xs font-mono text-[#66727D] mt-1 break-all">
                  {user._id || user.id || "Not available"}
                </p>

              </div>

            </div>


            {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}
            <div className="mt-7 pt-6 border-t border-gray-200">

              <p className="text-sm font-bold text-[#1F2933] mb-3">
                Quick Actions
              </p>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 bg-[#1F2933] hover:bg-[#2D3A45] text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm"
                >
                  📊 Dashboard
                </Link>


                {/* My Reports */}
                <Link
                  to="/my-reports"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-[#FFF9E6] text-[#1F2933] border border-gray-300 hover:border-[#F4B400] px-4 py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  📋 My Reports
                </Link>


                {/* Report Damage */}
                <Link
                  to="/report"
                  className="flex items-center justify-center gap-2 bg-[#F4B400] hover:bg-[#E5A900] text-[#1F2933] px-4 py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
                >
                  🚧 Report Damage
                </Link>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}
        <div className="text-center mt-5">

          <p className="text-xs text-[#A0A8AF]">
            Keep reporting road issues to help make your community safer.
          </p>

        </div>

      </div>
    </section>
  );
}

export default Profile;