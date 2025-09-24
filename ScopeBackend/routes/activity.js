const express = require("express");
const {
  getActivityLogs,
  createActivityLog,
  deleteActivityLog,
} = require("../controllers/activityController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET logs (optional query ?userId=)
router.get("/", protect, getActivityLogs);

// POST new log (internal use, protected)
router.post("/", protect, createActivityLog);

// DELETE log by ID (admin only)
router.delete("/:id", protect, deleteActivityLog);

module.exports = router;
