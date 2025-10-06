const InventoryMedicine = require("../models/InventoryMedicine");
const ActivityLog = require("../models/ActivityLog");

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

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
