import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import roadBg from "../assets/images/road-bg.jpg";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginType, setLoginType] = useState("user");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const user = response.data.user;

      // Admin cannot login from User tab
      if (loginType === "user" && user.role === "admin") {
        alert("Please use the Admin Login tab.");
        return;
      }

      // User cannot login from Admin tab
      if (loginType === "admin" && user.role !== "admin") {
        alert("Only administrators can login here.");
        return;
      }

      // Save login information
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(response.data.message);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed."
      );
    }
  };

  return (
    <section
      className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{
        backgroundImage: `url(${roadBg})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl px-7 py-6">

        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold text-blue-700">
            Login
          </h1>

          <p className="text-gray-800 mt-1 text-sm font-medium">
            Road Damage Reporting System
          </p>
        </div>

        {/* User/Admin Tabs */}
        <div className="flex mb-5 border border-gray-300 rounded-xl overflow-hidden bg-white/80">

          {/* User Login */}
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`w-1/2 py-2.5 font-semibold transition ${
              loginType === "user"
                ? "bg-blue-700 text-white"
                : "bg-white/80 text-gray-700 hover:bg-gray-100"
            }`}
          >
            User Login
          </button>

          {/* Admin Login */}
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`w-1/2 py-2.5 font-semibold transition ${
              loginType === "admin"
                ? "bg-blue-700 text-white"
                : "bg-white/80 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-1.5 font-semibold text-gray-800 text-sm">
              Email
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ✉
              </span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white/90 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 font-semibold text-gray-800 text-sm">
              Password
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                🔒
              </span>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white/90 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            {loginType === "admin"
              ? "Admin Login"
              : "User Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center mt-5 text-gray-800 text-sm">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Login;