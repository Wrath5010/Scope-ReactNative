const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryMedicine" },

  message: { type: String, required: true },

  type: { 
    type: String, 
    enum: ["expiry", "low-stock"], // only these two values for now(future scalable)
    required: true 
  },

  read: { type: Boolean, default: false },

  // Tracks who acknowledged the notification
  markedBy: [{user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    name: String, date: { type: Date, default: Date.now }}
  ],

  // Optional: when to reactivate if ignored
  reactivateAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now, expires: '30d'}, // TTL index auto delete
});

// Ensure TTL auto-delete after 30 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);

notificationSchema.index({ medicineId: 1, type: 1 }, { unique: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
