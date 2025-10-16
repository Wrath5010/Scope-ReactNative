const Notification = require("../models/Notification");
const InventoryMedicine = require("../models/InventoryMedicine");

// GET all notifications (everyone can see)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("medicineId", "name category expiryDate stockQuantity")
      .populate("markedBy.user", "name role")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single notification
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("medicineId", "name category expiryDate stockQuantity")
      .populate("markedBy.user", "name role");

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH: mark as read, basically acknowledge 
// Adds user to `markedBy`, sets read=true, and schedules reactivation in 24 hours.
const markAsRead = async (req, res) => {
  try {
    const user = req.user; // assuming middleware adds this

    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    // Add user mark if not already marked
    const alreadyMarked = notification.markedBy.some(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (!alreadyMarked) {
      notification.markedBy.push({
        user: user._id,
        name: user.name,
      });
    }

    notification.read = true;
    notification.reactivateAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // reminder after 24h
    await notification.save();

    res.json({
      message: `Notification marked as read by ${user.name}`,
      notification,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Routine check — finds expiring or low-stock medicines and creates notifications 
// Can be called manually (e.g., /api/notifications/check) or automatically (with a daily cron job)
const checkMedicinesForNotifications = async (req, res) => {
  try {
    const today = new Date();
    const EXPIRY_THRESHOLD = 30;
    const LOW_STOCK_THRESHOLD = 20;

    const medicines = await InventoryMedicine.find({ expiryDate: { $exists: true } });

    let newNotifications = [];

    for (const med of medicines) {
      const expiryDate = new Date(med.expiryDate);
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Skip expired
      if (diffDays < 0) continue;

      // Check expiry notifications
      if (diffDays <= EXPIRY_THRESHOLD) {
        const exists = await Notification.findOne({
          medicineId: med._id,
          type: "expiry",
        });

        if (!exists) {
          const note = await Notification.create({
            medicineId: med._id,
            message: `${med.name} will expire in ${diffDays} day${diffDays > 1 ? "s" : ""}.`,
            type: "expiry",
          });
          newNotifications.push(note);
        }
      }

      // Check low stock
      if (med.stockQuantity <= LOW_STOCK_THRESHOLD) {
        const exists = await Notification.findOne({
          medicineId: med._id,
          type: "lowStock",
        });

        if (!exists) {
          const note = await Notification.create({
            medicineId: med._id,
            message: `${med.name} is low on stock (${med.stockQuantity} left).`,
            type: "lowStock",
          });
          newNotifications.push(note);
        }
      }
    }

    res.json({
      message: "Routine notification check completed.",
      newNotifications: newNotifications.length,
      created: newNotifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reactivate previously marked notifications 
// (run daily — any marked but not acted on after 24h are reactivated)
const reactivateOldNotifications = async () => {
  try {
    const now = new Date();
    await Notification.updateMany(
      { read: true, reactivateAt: { $lte: now } },
      { $set: { read: false, reactivateAt: null } }
    );
  } catch (err) {
    console.error("Error reactivating notifications:", err.message);
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  checkMedicinesForNotifications,
  reactivateOldNotifications,
};
