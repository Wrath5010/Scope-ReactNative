const express = require("express");
const {
  getActivityLogs,
  createActivityLog,
  deleteActivityLog,
} = require("../controllers/activityController");

const router = express.Router();

// GET logs (optional query ?userId=)
router.get("/", getActivityLogs);

// POST new log (internal use, protected)
router.post("/", createActivityLog);

// DELETE log by ID (admin only)
router.delete("/:id", deleteActivityLog);

module.exports = router;
