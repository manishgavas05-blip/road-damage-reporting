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
// GET COMMUNITY REPORTS
// Logged-in users only
//
// Every logged-in user can see reports submitted by
// other users.
//
// PRIVATE INFORMATION NOT EXPOSED:
// - Phone number
// - Email
// - Password
//
// SAFE INFORMATION:
// - Reporter name
// - Damage type
// - Location
// - Latitude
// - Longitude
// - Description
// - Image
// - Status
// - Resolution note
// - Created date
// - Updated date
// =====================================================
router.get("/community", protect, async (req, res) => {
  try {
    const reports = await Report.find()
      .select(
        "user name location latitude longitude damageType description image status resolutionNote createdAt updatedAt"
      )
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("❌ Error fetching community reports:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET DASHBOARD STATISTICS
// ADMIN ONLY
//
// IMPORTANT:
// Keep this BEFORE /:id
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
//
// Used by the Home page map.
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
// GET RECENT ACTIVITY
// PUBLIC
//
// Used by the homepage Recent Activity section.
//
// Only safe information is returned.
// =====================================================
router.get("/recent-activity", async (req, res) => {
  try {
    const reports = await Report.find()
      .select(
        "damageType location status createdAt updatedAt"
      )
      .sort({
        updatedAt: -1,
        createdAt: -1,
      })
      .limit(6);

    const activities = reports.map((report) => {
      let type = "new";
      let title = "New road damage reported";

      // Resolved
      if (report.status === "Resolved") {
        type = "resolved";
        title = "Report resolved";
      }

      // In Progress
      else if (report.status === "In Progress") {
        type = "progress";
        title = "Report moved to In Progress";
      }

      // Pending / New
      else {
        type = "new";
        title = "New road damage reported";
      }

      return {
        id: report._id,
        type,
        title,
        damageType: report.damageType,
        location: report.location,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      };
    });

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL REPORTS
// ADMIN ONLY
//
// IMPORTANT:
// Keep this BEFORE /:id
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
//
// IMPORTANT:
// CommunityReports currently displays the reports,
// but this endpoint still prevents a normal user from
// opening another user's individual report.
//
// We will modify this in a later step if you want users
// to open full details of community reports.
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

    // =================================================
    // ADMIN CAN VIEW ANY REPORT
    // =================================================
    if (req.user.role === "admin") {
      return res.json({
        success: true,
        report,
      });
    }

    // =================================================
    // NORMAL USER CAN ONLY VIEW THEIR OWN REPORT
    // =================================================
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

      // =================================================
      // ALLOWED STATUSES
      // =================================================
      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      // =================================================
      // VALIDATE STATUS
      // =================================================
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

      // =================================================
      // REPORT NOT FOUND
      // =================================================
      if (!updatedReport) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      // =================================================
      // SUCCESS
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