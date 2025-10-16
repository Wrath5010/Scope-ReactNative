const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  medicineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "InventoryMedicine" 
  },

  message: { 
    type: String, 
    required: true 
  },

  type: { 
    type: String, 
    enum: ["expiry", "low-stock"], // only allow these two values
    required: true 
  },

  read: { 
    type: Boolean, 
    default: false 
  },

  // Tracks who acknowledged the notification
  markedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    date: { type: Date, default: Date.now }
  }],

  // Optional: when to reactivate if ignored
  reactivateAt: { 
    type: Date, 
    default: null 
  },

  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '30d' // TTL index to auto-delete after 30 days
  },
});

// Ensure TTL auto-delete after 30 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);

// Unique index to prevent duplicate notifications of same type for a medicine
notificationSchema.index({ medicineId: 1, type: 1 }, { unique: true });

// Prevent duplicate model compilation when using cron or hot reload
module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
