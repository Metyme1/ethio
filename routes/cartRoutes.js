const express = require("express");
const router = express.Router();

const {
  getCart,
  deleteFromCart,
  updateCartItem,
  addToCart,
} = require("../controllers/CartController");

const authMiddleware = require("../middlewares/authmiddleware");

router.post("/cart", authMiddleware, addToCart);

router.delete("/cart/:productId", authMiddleware, deleteFromCart);

router.put("/cart", authMiddleware, updateCartItem);

router.get("/cart", authMiddleware, getCart);

module.exports = router;
