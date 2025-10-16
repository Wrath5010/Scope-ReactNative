const cron = require("node-cron");
const InventoryMedicine = require("../models/InventoryMedicine");
const Notification = require("../models/Notification");

// Config thresholds
const EXPIRY_THRESHOLD_DAYS = 30;
const LOW_STOCK_THRESHOLD = 50;

// Helper function: calculate days difference
const getDaysDifference = (futureDate) => {
  const today = new Date();
  return Math.ceil((new Date(futureDate) - today) / (1000 * 60 * 60 * 24));
};

// Main notification check logic 
async function checkNotifications() {
  console.log(`[${new Date().toISOString()}] Running notification check...`);
  try {
    const medicines = await InventoryMedicine.find({});
    if (!medicines.length) return;

    const existingNotifications = await Notification.find({ read: false });
    const existingKeys = new Set(
      existingNotifications.map(n => `${n.medicineId.toString()}_${n.type}`)
    );

    const notificationsToCreate = [];

    for (const med of medicines) {
      // Expiry check
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

      // Low stock check
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
      console.log(`[${new Date().toISOString()}] Created ${notificationsToCreate.length} new notifications`);
    } else {
      console.log(`[${new Date().toISOString()}] No new notifications to create`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in notification check:`, err);
  }
}

// Startup check
(async () => {
  console.log("Running startup notification check...");
  await checkNotifications();
})();

// NOTEEEEEEEEE This cron job will only run if the Node.js server is running at the scheduled time.
// If the server is offline at 8AM, this job will not run until the next scheduled time.
// Cron can be optional, its just a nice added feature. Starting node server.js will load the check expiry and low stock expiry

// Daily Cron Job: Check Expiry & Low Stock (8AM)
cron.schedule("0 8 * * *", async () => {
  await checkNotifications();
});

// Reactivate ignored notifications (9AM) --- SAME with this..
// for the sake of testing reactivation, for presentation sake it will be loading in every 10 or 15 mins.
cron.schedule("0 15 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Reactivating ignored notifications...`);
  try {
    const ignored = await Notification.find({ read: true });
    if (!ignored.length) return;

    const medicines = await InventoryMedicine.find({});
    const medMap = new Map(medicines.map((m) => [m._id.toString(), m]));

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
    console.log(`[${new Date().toISOString()}] Reactivated ${notificationsToReactivate.length} notifications`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error reactivating notifications:`, err);
  }
});

module.exports = { checkNotifications };
