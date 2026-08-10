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
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-10"
      style={{
        backgroundImage: `url(${roadBg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-7 border border-white/30">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Join the Road Damage Reporting System
        </p>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 bg-white/75 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 bg-white/75 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 bg-white/75 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-md"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Register;