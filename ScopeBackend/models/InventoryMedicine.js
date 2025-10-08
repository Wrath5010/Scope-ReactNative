const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  expiryDate: { type: Date },
});



module.exports = mongoose.model("InventoryMedicine", medicineSchema);
