import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import roadBg from "../assets/images/road-bg.jpg";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert(response.data.message);

      // Redirect to Login after successful registration
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration failed."
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl shadow-2xl px-7 py-7">

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3F454B] flex items-center justify-center shadow-sm">
            <span className="text-amber-400 text-xl">🚧</span>
          </div>

          <h1 className="text-3xl font-bold text-[#3F454B]">
            Create Account
          </h1>

          <p className="text-slate-500 mt-1 text-sm font-medium">
            Join the Road Reporting System
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Full Name
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                👤
              </span>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-slate-300 bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Email Address
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ✉
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-slate-300 bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-[#3F454B] hover:bg-[#50575E] text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-5 text-slate-500 text-sm">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-amber-600 font-semibold hover:text-amber-700 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Register;