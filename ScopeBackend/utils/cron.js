const cron = require("node-cron");
const {
  checkNotificationsLogic,
  reactivateOldNotificationsLogic,
  cleanupReadNotificationsLogic,
} = require("../controllers/notificationController");

// --- Startup check ---
(async () => {
  console.log("Running startup notification check...");
  const created = await checkNotificationsLogic();
  console.log(`[${new Date().toISOString()}] Startup check: ${created} notifications created`);
})();

// --- Schedule cron jobs ---
// Daily check for expiry & low stock at 5 mins (if the local server is active for that long)
cron.schedule("0 5 * * * *", async () => {
  try {
    const created = await checkNotificationsLogic();
    console.log(`[${new Date().toISOString()}] Daily check: ${created} notifications created`);
  } catch (err) {
    console.error(err);
  }
});

// Reactivate ignored notifications every 15 secs (for demo/presentation)
cron.schedule("15 * * * * *", async () => {
  try {
    const reactivated = await reactivateOldNotificationsLogic();
    console.log(`[${new Date().toISOString()}] Reactivated ${reactivated} notifications`);
  } catch (err) {
    console.error(err);
  }
});

// Cleanup old read notifications daily at 30 secs
cron.schedule("30 * * * * *", async () => {
  try {
    const deleted = await cleanupReadNotificationsLogic();
    console.log(`[${new Date().toISOString()}] Cleaned up ${deleted} old read notifications`);
  } catch (err) {
    console.error(err);
  }
});
