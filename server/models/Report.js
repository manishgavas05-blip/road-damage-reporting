const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // User who created the report
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    damageType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Report status
    status: {
      type: String,
      default: "Pending",
    },

    // Admin note added when resolving/rejecting a report
    resolutionNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);