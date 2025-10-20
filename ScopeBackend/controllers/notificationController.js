const Notification = require("../models/Notification");
const InventoryMedicine = require("../models/InventoryMedicine");

// Config thresholds
const EXPIRY_THRESHOLD_DAYS = 30;
const LOW_STOCK_THRESHOLD = 50;
const CLEANUP_AFTER_DAYS = 3;

//calculate days difference
const getDaysDifference = (futureDate) => {
  const today = new Date();
  return Math.ceil((new Date(futureDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// --- Fetch all notifications ---
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("medicineId", "name category expiryDate stockQuantity")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// --- Fetch single notification ---
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("medicineId", "name category expiryDate stockQuantity");

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// --- Mark notification as read ---
const markAsRead = async (req, res) => {
  try {
    const user = req.user;
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    // Add user to markedBy if not already
    const alreadyMarked = notification.markedBy?.some(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (!alreadyMarked) {
      notification.markedBy.push({ user: user._id, name: user.name });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: `Notification marked as read by ${user.name}`, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// --- Cron/manual logic: check, reactivate, cleanup ---
// (Same as your current logic)
const checkNotificationsLogic = async () => {
  const medicines = await InventoryMedicine.find({});
  if (!medicines.length) return 0;

  const existingNotifications = await Notification.find({ read: false });
  const existingKeys = new Set(existingNotifications.map(n => `${n.medicineId.toString()}_${n.type}`));

  const notificationsToCreate = [];

  for (const med of medicines) {
    // Expiry
    if (med.expiryDate) {
      const diffDays = getDaysDifference(med.expiryDate);
      if (diffDays >= 0 && diffDays <= EXPIRY_THRESHOLD_DAYS) {
        const key = `${med._id.toString()}_expiry`;
        if (!existingKeys.has(key)) {
          notificationsToCreate.push({
            medicineId: med._id,
            message: `${med.name} will expire in ${diffDays} day${diffDays > 1 ? "s" : ""}.`,
            type: "expiry",
          });
          existingKeys.add(key);
        }
      }
    }

    // Low stock
    if (med.stockQuantity <= LOW_STOCK_THRESHOLD) {
      const key = `${med._id.toString()}_low-stock`;
      if (!existingKeys.has(key)) {
        notificationsToCreate.push({
          medicineId: med._id,
          message: `${med.name} stock is low (${med.stockQuantity} left).`,
          type: "low-stock",
        });
        existingKeys.add(key);
      }
    }
  }

  if (notificationsToCreate.length > 0) {
    await Notification.insertMany(notificationsToCreate);
  }

  return notificationsToCreate.length;
};

const checkNotifications = async (req, res) => {
  try {
    const count = await checkNotificationsLogic();
    res.json({ message: `Created ${count} notifications.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const reactivateOldNotificationsLogic = async () => {
  const ignored = await Notification.find({ read: true });
  if (!ignored.length) return 0;

  const medicines = await InventoryMedicine.find({});
  const medMap = new Map(medicines.map(m => [m._id.toString(), m]));

  const notificationsToReactivate = [];

  for (const note of ignored) {
    const med = medMap.get(note.medicineId.toString());
    if (!med) continue;

    let shouldReactivate = false;

    if (note.type === "expiry" && med.expiryDate) {
      const diffDays = getDaysDifference(med.expiryDate);
      if (diffDays >= 0 && diffDays <= EXPIRY_THRESHOLD_DAYS) shouldReactivate = true;
    }

    if (note.type === "low-stock" && med.stockQuantity <= LOW_STOCK_THRESHOLD) shouldReactivate = true;

    if (shouldReactivate) {
      note.read = false;
      notificationsToReactivate.push(note.save());
    }
  }

  await Promise.all(notificationsToReactivate);
  return notificationsToReactivate.length;
};

const reactivateOldNotifications = async (req, res) => {
  try {
    const count = await reactivateOldNotificationsLogic();
    res.json({ message: `Reactivated ${count} notifications.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const cleanupReadNotificationsLogic = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - CLEANUP_AFTER_DAYS);

  const result = await Notification.deleteMany({
    read: true,
    createdAt: { $lt: cutoff },
  });

  return result.deletedCount;
};

const cleanupReadNotifications = async (req, res) => {
  try {
    const count = await cleanupReadNotificationsLogic();
    res.json({ message: `Cleaned up ${count} old read notifications.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  checkNotifications,
  checkNotificationsLogic,
  reactivateOldNotifications,
  reactivateOldNotificationsLogic,
  cleanupReadNotifications,
  cleanupReadNotificationsLogic,
};
