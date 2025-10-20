const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  checkNotifications,
  reactivateOldNotifications,
  cleanupReadNotifications,
} = require("../controllers/notificationController");

// --- Fetch all notifications ---
router.get("/", getNotifications);

// --- Fetch single notification by ID ---
router.get("/:id", getNotificationById);

// --- Mark a notification as read ---
router.patch("/:id/read", markAsRead);

// --- Manual trigger: check medicines and create notifications ---
router.post("/check", checkNotifications);

// --- Manual trigger: reactivate ignored notifications ---
router.post("/reactivate", reactivateOldNotifications);

// --- Manual trigger: cleanup old read notifications ---
router.post("/cleanup", cleanupReadNotifications);

module.exports = router;
