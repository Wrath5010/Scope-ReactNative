const express = require("express");
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: GET all / single
router.get("/", getMedicines);
router.get("/:id", getMedicineById);

// Protected: create, update, delete
router.post("/", protect, createMedicine);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);

module.exports = router;
