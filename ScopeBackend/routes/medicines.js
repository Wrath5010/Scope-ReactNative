const express = require("express");
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  checkExpiryForAll
} = require("../controllers/medicineController");

const router = express.Router();

// Check expiry for all medicines
router.get("/check-expiry", checkExpiryForAll);

// Public: GET all / single
router.get("/", getMedicines);
router.get("/:id", getMedicineById);

// Protected: create, update, delete
router.post("/", createMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

//these are all protected, check server.js
module.exports = router;
