const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const { protect, authorize } = require("./middleware/authMiddleware");

require("./utils/cronJobs");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const medicineRoutes = require("./routes/medicines");
const notificationRoutes = require("./routes/notifications"); 
const activityRoutes = require("./routes/activity"); 

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", protect, medicineRoutes);
app.use("/api/notifications", protect, notificationRoutes);
app.use("/api/activity", protect, activityRoutes);
app.use("/api/users", protect, authorize("admin"), userRoutes);


// Default route
app.get("/", (req, res) => res.send("Backend is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
