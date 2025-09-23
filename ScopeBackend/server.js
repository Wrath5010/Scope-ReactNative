const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const InventoryMedicine = require("./models/InventoryMedicine"); 

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Default route (test if server is alive)A
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// CREATE (Add a medicine)
app.post("/medicines", async (req, res) => {
  try {
    const newMedicine = new InventoryMedicine(req.body);
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// READ (Get all medicines)
app.get("/medicines", async (req, res) => {
  try {
    const medicines = await InventoryMedicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (Get single medicine by ID)
app.get("/medicines/:id", async (req, res) => {
  try {
    const medicine = await InventoryMedicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ error: "Not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (Edit medicine by ID)
app.put("/medicines/:id", async (req, res) => {
  try {
    const updatedMedicine = await InventoryMedicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );
    if (!updatedMedicine) return res.status(404).json({ error: "Not found" });
    res.json(updatedMedicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (Remove medicine by ID)
app.delete("/medicines/:id", async (req, res) => {
  try {
    const deleted = await InventoryMedicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
