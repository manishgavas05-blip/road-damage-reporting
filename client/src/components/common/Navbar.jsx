import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);

    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("Failed to read user from localStorage:", error);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    navigate("/login");
  };

  const isLoggedIn = Boolean(token && user);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-3.5 flex items-center justify-between">

        {/* =================================================
            LOGO
        ================================================= */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          {/* Road Icon */}
          <div className="relative w-9 h-9 rounded-lg bg-[#1F2933] flex items-center justify-center overflow-hidden shadow-sm">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-[#F4B400]" />

            <div className="absolute left-1/2 -translate-x-1/2 h-full flex flex-col justify-around py-1">
              <span className="w-0.5 h-1.5 bg-white rounded-full" />
              <span className="w-0.5 h-1.5 bg-white rounded-full" />
              <span className="w-0.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          {/* Brand Name */}
          <div className="leading-tight">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1F2933] group-hover:text-[#263B4A] transition">
              Road Reporting
            </h1>

            <p className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-[#66727D] font-semibold">
              Report • Track • Improve
            </p>
          </div>
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}
        <div className="flex items-center gap-2 md:gap-5">

          {isLoggedIn ? (
            <>
              {/* Home */}
              <Link
                to="/"
                className={`hidden sm:block px-2 py-2 text-sm font-semibold transition ${
                  isActive("/")
                    ? "text-[#1F2933]"
                    : "text-[#66727D] hover:text-[#1F2933]"
                }`}
              >
                Home
              </Link>

              {/* =================================================
                  NORMAL USER
              ================================================= */}
              {user.role !== "admin" && (
                <>
                  {/* Report Damage */}
                  <Link
                    to="/report"
                    className={`hidden md:block px-2 py-2 text-sm font-semibold transition ${
                      isActive("/report")
                        ? "text-[#1F2933]"
                        : "text-[#66727D] hover:text-[#1F2933]"
                    }`}
                  >
                    Report Damage
                  </Link>

                  {/* Community Reports */}
                  <Link
                    to="/community-reports"
                    className={`hidden md:block px-2 py-2 text-sm font-semibold transition ${
                      isActive("/community-reports")
                        ? "text-[#1F2933]"
                        : "text-[#66727D] hover:text-[#1F2933]"
                    }`}
                  >
                    Community Reports
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className={`hidden sm:block px-2 py-2 text-sm font-semibold transition ${
                      isActive("/profile")
                        ? "text-[#1F2933]"
                        : "text-[#66727D] hover:text-[#1F2933]"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* =================================================
                  ADMIN
              ================================================= */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`hidden sm:block px-2 py-2 text-sm font-semibold transition ${
                    isActive("/admin")
                      ? "text-[#1F2933]"
                      : "text-[#66727D] hover:text-[#1F2933]"
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-[#1F2933] hover:bg-[#263B4A] text-white px-4 md:px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* =================================================
                  LOGGED OUT - HOME
              ================================================= */}
              <Link
                to="/"
                className={`hidden sm:block px-2 py-2 text-sm font-semibold transition ${
                  isActive("/")
                    ? "text-[#1F2933]"
                    : "text-[#66727D] hover:text-[#1F2933]"
                }`}
              >
                Home
              </Link>

              {/* Login */}
              <Link
                to="/login"
                className={`hidden sm:block px-2 py-2 text-sm font-semibold transition ${
                  isActive("/login")
                    ? "text-[#1F2933]"
                    : "text-[#66727D] hover:text-[#1F2933]"
                }`}
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="bg-[#F4B400] hover:bg-[#D99A00] text-[#1F2933] px-4 md:px-5 py-2 rounded-lg text-sm font-bold transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;