const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// =====================================================
// CREATE REPORT
// Logged-in users only
// =====================================================
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("========== NEW REPORT ==========");
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      const report = new Report({
        user: req.user.id,

        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,

        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),

        damageType: req.body.damageType,
        description: req.body.description,

        image: req.file ? req.file.filename : "",

        status: "Pending",

        // No resolution note when a report is first created
        resolutionNote: "",
      });

      console.log("Before Save:", report);

      await report.save();

      console.log("After Save:", report);

      res.status(201).json({
        success: true,
        message: "Report submitted successfully",
        report,
      });
    } catch (error) {
      console.error("❌ Error Saving Report:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET MY REPORTS
// Logged-in users only
// =====================================================
router.get("/my", protect, async (req, res) => {
  try {
    const reports = await Report.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("❌ Error fetching my reports:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET DASHBOARD STATISTICS
// ADMIN ONLY
// IMPORTANT: Keep this BEFORE /:id
// =====================================================
router.get(
  "/stats",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const total = await Report.countDocuments();

      const pending = await Report.countDocuments({
        status: "Pending",
      });

      const inProgress = await Report.countDocuments({
        status: "In Progress",
      });

      const resolved = await Report.countDocuments({
        status: "Resolved",
      });

      res.json({
        success: true,
        total,
        pending,
        inProgress,
        resolved,
      });
    } catch (error) {
      console.error("❌ Error fetching statistics:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET REPORTS FOR MAP
// PUBLIC
// Keep public because the Home page shows the map
// =====================================================
router.get("/map", async (req, res) => {
  try {
    const reports = await Report.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("❌ Error fetching map reports:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL REPORTS
// ADMIN ONLY
// IMPORTANT: Keep this BEFORE /:id
// =====================================================
router.get(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        reports,
      });
    } catch (error) {
      console.error("❌ Error fetching all reports:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET SINGLE REPORT
// Logged-in users only
//
// Admin → can view any report
// User  → can view only their own report
// =====================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    // Admin can view any report
    if (req.user.role === "admin") {
      return res.json({
        success: true,
        report,
      });
    }

    // Normal user can only view their own report
    if (report.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this report.",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("❌ Error fetching report:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE REPORT STATUS + RESOLUTION NOTE
// ADMIN ONLY
// =====================================================
router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status, resolutionNote } = req.body;

      // Allowed statuses
      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      // Validate status
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid report status.",
        });
      }

      // =================================================
      // RESOLVED REPORT MUST HAVE A RESOLUTION NOTE
      // =================================================
      if (
        status === "Resolved" &&
        (!resolutionNote || !resolutionNote.trim())
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a resolution note before resolving the report.",
        });
      }

      // =================================================
      // PREPARE UPDATE DATA
      // =================================================
      const updateData = {
        status,
      };

      // Save resolution note when provided
      if (resolutionNote !== undefined) {
        updateData.resolutionNote = resolutionNote.trim();
      }

      // =================================================
      // UPDATE REPORT
      // =================================================
      const updatedReport =
        await Report.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      // Report not found
      if (!updatedReport) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      // =================================================
      // SUCCESS RESPONSE
      // =================================================
      res.json({
        success: true,
        message: "Report status updated successfully",
        report: updatedReport,
      });
    } catch (error) {
      console.error("❌ Error updating report:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// DELETE REPORT
// ADMIN ONLY
// =====================================================
router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const deletedReport =
        await Report.findByIdAndDelete(req.params.id);

      if (!deletedReport) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      res.json({
        success: true,
        message: "Report deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting report:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;