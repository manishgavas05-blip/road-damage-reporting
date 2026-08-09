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
        // Admin → Admin Dashboard
        navigate("/admin");
      } else {
        // User → Home Page
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-10"
      style={{
        backgroundImage: `url(${roadBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10">

        {/* Heading */}
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-2">
          Login
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Road Damage Reporting System
        </p>

        {/* User/Admin Tabs */}
        <div className="flex mb-8 border rounded-xl overflow-hidden">

          {/* User Login */}
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`w-1/2 py-3 font-semibold transition ${
              loginType === "user"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            User Login
          </button>

          {/* Admin Login */}
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`w-1/2 py-3 font-semibold transition ${
              loginType === "admin"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Admin Login
          </button>

        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold text-lg transition shadow-md"
          >
            {loginType === "admin"
              ? "Admin Login"
              : "User Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center mt-8 text-gray-600">
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