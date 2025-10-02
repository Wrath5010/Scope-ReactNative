const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/usersController");

const router = express.Router();

// All routes protected and admin-only
router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
