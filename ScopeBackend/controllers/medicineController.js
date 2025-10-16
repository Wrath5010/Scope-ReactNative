const InventoryMedicine = require("../models/InventoryMedicine");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");


// GET all medicines
const getMedicines = async (req, res) => {
  try {
    const medicines = await InventoryMedicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await InventoryMedicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new medicine
const createMedicine = async (req, res) => {
  try {
    const medicine = new InventoryMedicine(req.body);
    await medicine.save();

    //log activity
    if (req.user) {
      await ActivityLog.create({
        userId: req.user.id,
        action: "Created medicine",
        entity: "Medicine",
        entityId: medicine._id,
        details: req.body,
      });
    }

    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE medicine by ID
const updateMedicine = async (req, res) => {
  try {
    const medicine = await InventoryMedicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    //log activity
    if (req.user) {
      await ActivityLog.create({
        userId: req.user.id,
        action: "Updated medicine",
        entity: "Medicine",
        entityId: medicine._id,
        details: req.body,
      });
    }

    res.json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE medicine by ID
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await InventoryMedicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    //log activity
    if (req.user) {
      await ActivityLog.create({
        userId: req.user.id,
        action: "Deleted medicine",
        entity: "Medicine",
        entityId: medicine._id,
        details: medicine,
      });
    }

    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check all medicines for upcoming expiry
const checkExpiryForAll = async (req, res) => {
  try {
    const today = new Date();
    const EXPIRY_THRESHOLD_DAYS = 30; // Medicines expiring within 30 days
    const medicines = await InventoryMedicine.find({ expiryDate: { $exists: true } });

    let createdNotifications = [];

    for (const med of medicines) {
      const expiryDate = new Date(med.expiryDate);
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Skip medicines already expired
      if (diffDays < 0) continue;

      // Only create notifications for medicines within threshold
      if (diffDays <= EXPIRY_THRESHOLD_DAYS) {
        const existing = await Notification.findOne({
          medicineId: med._id,
          type: "expiry",
          read: false,
        });

        if (!existing) {
          const note = await Notification.create({
            medicineId: med._id,
            message: `${med.name} will expire in ${diffDays} day${diffDays > 1 ? 's' : ''}.`,
            type: "expiry",
          });
          createdNotifications.push(note);
        }
      }
    }

    res.json({
      message: "Expiry check completed",
      newNotifications: createdNotifications.length,
      createdNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  checkExpiryForAll
};
