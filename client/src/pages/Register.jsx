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
    className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
    style={{ backgroundImage: `url(${roadBg})` }}
  >
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    {/* Register Card */}
    <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8">

      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        Create Account
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Join the Road Damage Reporting System
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-medium mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition"
        >
          Create Account
        </button>

      </form>

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