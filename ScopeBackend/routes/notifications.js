const express = require("express");
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  checkMedicinesForNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.patch("/:id/read", markAsRead);

router.get("/check/all", checkMedicinesForNotifications);

module.exports = router;
