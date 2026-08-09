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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-blue-700"
        >
          🚧 Road Damage
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 md:gap-6">

          {isLoggedIn ? (
            <>
              {/* Home */}
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Home
              </Link>

              {/* Normal User */}
              {user.role !== "admin" && (
                <>
                  <Link
                    to="/report"
                    className="text-gray-700 hover:text-blue-700 font-medium transition"
                  >
                    Report Damage
                  </Link>

                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-700 font-medium transition"
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* Admin */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-700 font-medium transition"
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Logged Out */}
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-700 font-medium transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition"
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