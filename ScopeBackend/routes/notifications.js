const express = require("express");
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public or protected depending on your app
router.get("/", protect, getNotifications);
router.get("/:id", protect, getNotificationById);

// Mark as read and delete require protection
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
