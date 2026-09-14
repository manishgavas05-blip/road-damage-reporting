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
    confirmPassword: "",
  });

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // NAME VALIDATION
  // =====================================================
  const validateName = (name) => {
    const value = name.trim();

    if (!value) {
      return "Name is required.";
    }

    if (value.length < 2) {
      return "Invalid name: name must contain at least 2 characters.";
    }

    if (/\d/.test(value)) {
      return "Invalid name: name cannot contain numbers.";
    }

    if (/[^A-Za-z\s-]/.test(value)) {
      return "Invalid name: name can only contain letters, spaces, and hyphens.";
    }

    if (/\s{2,}/.test(value)) {
      return "Invalid name: name cannot contain multiple consecutive spaces.";
    }

    if (/^-|-$/.test(value)) {
      return "Invalid name: name cannot start or end with a hyphen.";
    }

    return "";
  };

  // =====================================================
  // EMAIL VALIDATION
  // =====================================================
  const validateEmail = (email) => {
    const value = email.trim();

    if (!value) {
      return "Email is required.";
    }

    if (/\s/.test(value)) {
      return "Invalid email: email cannot contain spaces.";
    }

    if (!value.includes("@")) {
      return "Invalid email: missing @ symbol.";
    }

    const parts = value.split("@");

    if (parts.length !== 2) {
      return "Invalid email: email must contain only one @ symbol.";
    }

    const username = parts[0];
    const domain = parts[1];

    if (!username) {
      return "Invalid email: email name is missing before @.";
    }

    if (!domain) {
      return "Invalid email: domain name is missing after @.";
    }

    if (!domain.includes(".")) {
      return "Invalid email: domain must contain a valid extension, such as .com.";
    }

    if (domain.startsWith(".") || domain.endsWith(".")) {
      return "Invalid email: domain format is incorrect.";
    }

    if (domain.includes("..")) {
      return "Invalid email: domain cannot contain consecutive dots.";
    }

    const emailRegex =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

    if (!emailRegex.test(value)) {
      return "Invalid email: please enter a valid email address.";
    }

    return "";
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      setNameError(validateName(value));
    }

    if (name === "email") {
      setEmailError(validateEmail(value));
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // =====================================================
  // HANDLE REGISTER
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const nameValidationError = validateName(formData.name);

    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    // Validate email
    const emailValidationError = validateEmail(formData.email);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    // Validate password
    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      return;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      setPasswordError("Please confirm your password.");
      return;
    }

    // Compare passwords
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Invalid password: passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );

      alert(response.data.message);

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

          {/* =====================================================
              FULL NAME
          ====================================================== */}
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
                className={`w-full border ${
                  nameError
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-slate-300 focus:ring-amber-400 focus:border-amber-400"
                } bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition`}
                required
              />
            </div>

            {/* Name Error */}
            {nameError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                ⚠ {nameError}
              </p>
            )}
          </div>

          {/* =====================================================
              EMAIL
          ====================================================== */}
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
                className={`w-full border ${
                  emailError
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-slate-300 focus:ring-amber-400 focus:border-amber-400"
                } bg-white rounded-lg py-3 pl-10 pr-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition`}
                required
              />
            </div>

            {/* Email Error */}
            {emailError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                ⚠ {emailError}
              </p>
            )}
          </div>

          {/* =====================================================
              PASSWORD
          ====================================================== */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Password
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔒
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full border ${
                  passwordError
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-slate-300 focus:ring-amber-400 focus:border-amber-400"
                } bg-white rounded-lg py-3 pl-10 pr-12 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* =====================================================
              CONFIRM PASSWORD
          ====================================================== */}
          <div>
            <label className="block mb-1.5 font-semibold text-slate-700 text-sm">
              Confirm Password
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔒
              </span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full border ${
                  passwordError
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-slate-300 focus:ring-amber-400 focus:border-amber-400"
                } bg-white rounded-lg py-3 pl-10 pr-12 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Password Error */}
            {passwordError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                ⚠ {passwordError}
              </p>
            )}
          </div>

          {/* =====================================================
              SUBMIT BUTTON
          ====================================================== */}
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