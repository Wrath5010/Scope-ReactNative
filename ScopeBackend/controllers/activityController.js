const ActivityLog = require("../models/ActivityLog");

// GET all activity logs (optional filter by user)
const getActivityLogs = async (req, res) => {
  try {
    let query = {};

    // If pharmacist → only see their own logs
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    }

    const logs = await ActivityLog.find(query)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new activity log (usually internal use)
const createActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a log by ID (admin only)
const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: "Activity log not found" });
    res.json({ message: "Activity log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getActivityLogs, createActivityLog, deleteActivityLog };
