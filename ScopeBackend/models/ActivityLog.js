const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: String,
  entity: String,
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

activitySchema.index({ action: "text" });

module.exports = mongoose.model("ActivityLog", activitySchema);
