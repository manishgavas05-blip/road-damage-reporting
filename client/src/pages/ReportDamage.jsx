import { useState, useEffect } from "react";
import axios from "axios";

function ReportDamage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    damageType: "Pothole",
    description: "",
    image: null,
  });

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [loadingLocation, setLoadingLocation] = useState(true);

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
      return "Invalid name: numbers are not allowed.";
    }

    if (!/^[A-Za-z\s-]+$/.test(value)) {
      return "Invalid name: only letters, spaces and hyphens are allowed.";
    }

    if (/\s{2,}/.test(value)) {
      return "Invalid name: consecutive spaces are not allowed.";
    }

    if (/^\s|\s$/.test(name)) {
      return "Invalid name: name cannot start or end with a space.";
    }

    if (/^-|-$/.test(value)) {
      return "Invalid name: name cannot start or end with a hyphen.";
    }

    return "";
  };

  // =====================================================
  // PHONE VALIDATION
  // =====================================================
  const validatePhone = (phone) => {
    const value = phone.trim();

    if (!value) {
      return "Phone number is required.";
    }

    if (/[A-Za-z]/.test(value)) {
      return "Invalid phone number: letters are not allowed.";
    }

    if (!/^\+?[0-9]+$/.test(value)) {
      return "Invalid phone number: only digits are allowed, with an optional + at the beginning.";
    }

    const digitsOnly = value.replace("+", "");

    if (digitsOnly.length !== 10) {
      return "Invalid phone number: phone number must contain exactly 10 digits.";
    }

    if (/^0{10}$/.test(digitsOnly)) {
      return "Invalid phone number: please enter a valid phone number.";
    }

    return "";
  };

  // =====================================================
  // GET USER LOCATION + ADDRESS
  // =====================================================
  const getLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const addr = response.data.address;

          const area =
            addr.suburb ||
            addr.neighbourhood ||
            addr.city_district ||
            addr.town ||
            addr.village ||
            "";

          const city =
            addr.city ||
            addr.county ||
            addr.state_district ||
            "";

          const address =
            area && city
              ? `${area}, ${city}`
              : response.data.display_name;

          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location: address,
          }));
        } catch (error) {
          console.error("Reverse geocoding failed:", error);

          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        }

        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to detect your location.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate name while typing
    if (name === "name") {
      setNameError(validateName(value));
    }

    // Validate phone while typing
    if (name === "phone") {
      setPhoneError(validatePhone(value));
    }
  };

  // =====================================================
  // SUBMIT REPORT
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const currentNameError = validateName(formData.name);
    setNameError(currentNameError);

    // Validate phone
    const currentPhoneError = validatePhone(formData.phone);
    setPhoneError(currentPhoneError);

    // Stop submission if name or phone is invalid
    if (currentNameError || currentPhoneError) {
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      alert("Please wait until your location is detected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("location", formData.location);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("damageType", formData.damageType);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/reports",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);

      setFormData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        damageType: "Pothole",
        description: "",
        image: null,
      }));

      setNameError("");
      setPhoneError("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit report."
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#1F2933] py-10 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-[#343B42] border border-[#454A4F] rounded-full px-3 py-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F4B400]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F4B400]">
              Road Reporting
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Report Road Damage
          </h1>

          <p className="text-sm text-[#AEB6BE] mt-2 max-w-xl mx-auto leading-relaxed">
            Help improve road safety by reporting potholes, cracks,
            waterlogging and other road-related issues.
          </p>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}
        <div className="bg-[#272D32] rounded-xl border border-[#3C4349] shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden">

          {/* =====================================================
              CARD HEADER
          ===================================================== */}
          <div className="bg-[#343B42] px-5 sm:px-6 py-4 border-b border-[#454A4F]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4B400] text-[#1F2933] flex items-center justify-center text-lg shadow-sm">
                🚧
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Submit a Report
                </h2>

                <p className="text-xs text-[#B7BEC5] mt-0.5">
                  Provide accurate information about the road issue.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              FORM
          ===================================================== */}
          <form
            onSubmit={handleSubmit}
            className="px-5 sm:px-6 py-6 space-y-6"
          >

            {/* =====================================================
                SECTION 01 — CONTACT
            ===================================================== */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-[#F4B400] bg-[#3A3423] rounded-md px-2 py-1">
                  01
                </span>

                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#D5DADE] mb-1.5">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${
                      nameError
                        ? "border-red-500"
                        : "border-[#4A5259]"
                    } rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#7F8992] bg-[#20262B] focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition`}
                    required
                  />

                  {nameError && (
                    <p className="text-xs text-red-400 mt-1.5 font-medium">
                      ⚠ {nameError}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#D5DADE] mb-1.5">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border ${
                      phoneError
                        ? "border-red-500"
                        : "border-[#4A5259]"
                    } rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#7F8992] bg-[#20262B] focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition`}
                    required
                  />

                  {phoneError && (
                    <p className="text-xs text-red-400 mt-1.5 font-medium">
                      ⚠ {phoneError}
                    </p>
                  )}
                </div>

              </div>
            </div>

            <div className="border-t border-[#3B4248]" />

            {/* =====================================================
                SECTION 02 — LOCATION
            ===================================================== */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-[#F4B400] bg-[#3A3423] rounded-md px-2 py-1">
                  02
                </span>

                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Location
                </h3>
              </div>

              <label className="block text-xs font-semibold text-[#D5DADE] mb-1.5">
                Detected Location
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={
                    loadingLocation
                      ? "Detecting your location..."
                      : formData.location
                  }
                  readOnly
                  className="w-full border border-[#4A5259] rounded-lg px-3 py-2.5 pr-10 text-sm bg-[#20262B] text-[#C5CBD1] focus:outline-none"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  📍
                </span>
              </div>

              <p className="text-[11px] text-[#858F98] mt-1.5">
                Your current location is automatically detected using GPS.
              </p>
            </div>

            <div className="border-t border-[#3B4248]" />

            {/* =====================================================
                SECTION 03 — DAMAGE DETAILS
            ===================================================== */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-[#F4B400] bg-[#3A3423] rounded-md px-2 py-1">
                  03
                </span>

                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Damage Details
                </h3>
              </div>

              <div className="space-y-4">

                {/* Damage Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#D5DADE] mb-1.5">
                    Damage Type
                  </label>

                  <select
                    name="damageType"
                    value={formData.damageType}
                    onChange={handleChange}
                    className="w-full border border-[#4A5259] rounded-lg px-3 py-2.5 text-sm bg-[#20262B] text-white focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition"
                  >
                    <option>Pothole</option>
                    <option>Road Crack</option>
                    <option>Broken Road</option>
                    <option>Water Logging</option>
                    <option>Street Light Damage</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#D5DADE]">
                      Description
                    </label>

                    <span className="text-[10px] text-[#7F8992]">
                      Be specific
                    </span>
                  </div>

                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe the road damage, its size, severity, or any danger it may cause..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-[#4A5259] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#7F8992] bg-[#20262B] resize-none focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition"
                    required
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#D5DADE] mb-1.5">
                    Road Damage Photo
                  </label>

                  <div className="border border-dashed border-[#4A5259] rounded-lg p-4 bg-[#20262B] hover:border-[#F4B400] hover:bg-[#252B30] transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#343B42] text-[#F4B400] flex items-center justify-center text-sm">
                        📷
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white">
                          Upload a clear image
                        </p>

                        <p className="text-[11px] text-[#858F98]">
                          A photo helps authorities verify the issue.
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full text-xs text-[#AEB6BE] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-[#343B42] file:text-white file:text-xs file:font-semibold hover:file:bg-[#454A4F] file:cursor-pointer"
                    />

                    {formData.image && (
                      <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                        ✓ {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* =====================================================
                GPS STATUS
            ===================================================== */}
            <div className="rounded-lg border border-[#454C52] bg-[#20262B] p-4">
              {loadingLocation ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#343B42] text-[#F4B400] flex items-center justify-center animate-pulse">
                    📍
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Detecting your location...
                    </p>

                    <p className="text-xs text-[#858F98] mt-0.5">
                      Please wait while GPS coordinates are retrieved.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F4B400]">
                        📍
                      </span>

                      <p className="text-sm font-bold text-white">
                        Location Detected
                      </p>
                    </div>

                    <span className="text-[10px] uppercase tracking-wide bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-2 py-1 rounded-full font-bold">
                      Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#292F34] border border-[#454C52] rounded-lg p-3">
                      <span className="font-semibold text-[#8E98A1]">
                        Latitude
                      </span>

                      <p className="mt-1 text-white font-medium break-all">
                        {formData.latitude}
                      </p>
                    </div>

                    <div className="bg-[#292F34] border border-[#454C52] rounded-lg p-3">
                      <span className="font-semibold text-[#8E98A1]">
                        Longitude
                      </span>

                      <p className="mt-1 text-white font-medium break-all">
                        {formData.longitude}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#454C52]">
                    <p className="text-xs font-semibold text-[#8E98A1]">
                      Detected Address
                    </p>

                    <p className="text-sm text-white mt-1">
                      {formData.location || "Address unavailable"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={getLocation}
                    className="mt-3 text-xs font-bold text-[#C5CBD1] hover:text-[#F4B400] transition"
                  >
                    ↻ Refresh Location
                  </button>
                </>
              )}
            </div>

            {/* =====================================================
                SUBMIT
            ===================================================== */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loadingLocation}
                className={`w-full py-3 rounded-lg font-bold text-sm transition ${
                  loadingLocation
                    ? "bg-[#454A4F] text-[#858F98] cursor-not-allowed"
                    : "bg-[#F4B400] hover:bg-[#D99A00] text-[#1F2933] shadow-sm hover:shadow-md active:scale-[0.99]"
                }`}
              >
                {loadingLocation
                  ? "Detecting Location..."
                  : "Submit Road Damage Report"}
              </button>

              <p className="text-center text-[11px] text-[#7F8992] mt-2">
                Your report will be submitted with the detected GPS location.
              </p>
            </div>

          </form>
        </div>

        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-[#7F8992]">
          <span>🛡️</span>

          <span>
            Your location and report details are used for road reporting.
          </span>
        </div>

      </div>
    </section>
  );
}

export default ReportDamage;