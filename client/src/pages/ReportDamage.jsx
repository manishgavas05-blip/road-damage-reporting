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
          // Reverse Geocoding using OpenStreetMap
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

          console.log("Detected Address:", address);
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

      // Keep detected location after submit
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
    <section className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Report Road Damage
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100"
          />

          <select
            name="damageType"
            value={formData.damageType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>Pothole</option>
            <option>Road Crack</option>
            <option>Broken Road</option>
            <option>Water Logging</option>
            <option>Street Light Damage</option>
          </select>

          <textarea
            name="description"
            rows="5"
            placeholder="Describe the damage"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          {/* GPS Status */}
          <div className="bg-blue-50 rounded-lg p-4">

            {loadingLocation ? (
              <p className="text-blue-700 font-semibold">
                📍 Detecting your location...
              </p>
            ) : (
              <>
                <p className="text-blue-700">
                  <strong>Latitude:</strong> {formData.latitude}
                </p>

                <p className="text-blue-700">
                  <strong>Longitude:</strong> {formData.longitude}
                </p>

                <p className="text-green-700 mt-2">
                  <strong>Detected Address:</strong>
                  <br />
                  {formData.location}
                </p>

                <button
                  type="button"
                  onClick={getLocation}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  📍 Refresh Location
                </button>
              </>
            )}

          </div>

          <button
            type="submit"
            disabled={loadingLocation}
            className={`w-full py-3 rounded-lg text-white transition ${
              loadingLocation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loadingLocation
              ? "Detecting Location..."
              : "Submit Report"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default ReportDamage;