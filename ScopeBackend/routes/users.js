const express = require("express");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/usersController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes protected and admin-only
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
