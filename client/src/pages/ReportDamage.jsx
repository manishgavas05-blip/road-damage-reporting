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

  const [loadingLocation, setLoadingLocation] = useState(true);

  // ===============================
  // GET USER LOCATION + ADDRESS
  // ===============================
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert("Please wait until your location is detected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
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
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit report."
      );
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-8 px-4">

      {/* Main Card */}
      <div className="mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-center text-blue-700">
            Report Road Damage
          </h1>

          <p className="text-center text-gray-500 text-sm mt-1">
            Help us identify and fix road problems in your area.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-4"
        >

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Detected Location
            </label>

            <input
              type="text"
              name="location"
              value={
                loadingLocation
                  ? "Detecting your location..."
                  : formData.location
              }
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Damage Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Damage Type
            </label>

            <select
              name="damageType"
              value={formData.damageType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>

            <textarea
              name="description"
              rows="3"
              placeholder="Describe the road damage..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Image
            </label>

            <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-600"
              />

              <p className="text-xs text-gray-400 mt-1">
                Upload a clear photo of the damaged road.
              </p>
            </div>
          </div>

          {/* GPS Status */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

            {loadingLocation ? (
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-blue-600">
                  📍
                </span>

                <p className="text-sm font-semibold text-blue-700">
                  Detecting your location...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-800">
                    📍 Location Detected
                  </p>

                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold">
                      Latitude
                    </span>

                    <p className="mt-1 text-gray-800">
                      {formData.latitude}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold">
                      Longitude
                    </span>

                    <p className="mt-1 text-gray-800">
                      {formData.longitude}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-100">
                  <p className="text-xs font-semibold text-gray-600">
                    Detected Address
                  </p>

                  <p className="text-sm text-gray-800 mt-1">
                    {formData.location || "Address unavailable"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900 transition"
                >
                  ↻ Refresh Location
                </button>
              </>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loadingLocation}
            className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition shadow-sm ${
              loadingLocation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 active:scale-[0.99]"
            }`}
          >
            {loadingLocation
              ? "Detecting Location..."
              : "Submit Road Damage Report"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default ReportDamage;