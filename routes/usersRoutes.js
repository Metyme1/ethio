const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  loginUser,
  changePassword,
  registerUser,
  getUserById,
} = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authmiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/admin/create-user",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUser
);
router.put(
  "/admin/update-user/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUser
);
router.delete(
  "/admin/delete-user/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteUser
);
router.get(
  "/admin/users",
  // authMiddleware,
  // roleMiddleware(["admin"]),
  getAllUsers
);
router.get("/user/:id", authMiddleware, getUserById);

router.put("/change-password", authMiddleware, changePassword);

// User login route
router.post("/login", loginUser);


router.post("/register", registerUser);



module.exports = router;
