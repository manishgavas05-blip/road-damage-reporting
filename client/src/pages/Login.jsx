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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#263238]/45"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl shadow-2xl px-7 py-7">

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3F454B] flex items-center justify-center shadow-sm">
            <span className="text-amber-400 text-xl">🚧</span>
          </div>

          <h1 className="text-3xl font-bold text-[#3F454B]">
            Login
          </h1>

          <p className="text-slate-500 mt-1 text-sm font-medium">
            Road Reporting System
          </p>
        </div>

        {/* User/Admin Tabs */}
        <div className="flex mb-6 border border-slate-300 rounded-xl overflow-hidden bg-slate-100">

          {/* User Login */}
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`w-1/2 py-2.5 font-semibold transition ${
              loginType === "user"
                ? "bg-[#3F454B] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                ? "bg-[#3F454B] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Email
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ✉
              </span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Password
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔒
              </span>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#3F454B] hover:bg-[#50575E] text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            {loginType === "admin" ? "Admin Login" : "User Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-5 text-slate-500 text-sm">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-amber-600 font-semibold hover:text-amber-700 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Login;