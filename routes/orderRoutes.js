const express = require("express");
const {
  createOrAddToOrder,
  getAllOrders,
  updateOrder,
  cancelOrder,
  getOrdersByCustomer,
} = require("../controllers/orderController");
const authmiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", authmiddleware, createOrAddToOrder);
router.get("/", authmiddleware, getAllOrders);
router.put("/:id", authmiddleware, updateOrder);
router.delete("/:id/cancel", authmiddleware, cancelOrder);
router.get("/:customer_id", authmiddleware, getOrdersByCustomer);

// router.post("/", createOrder);
// router.get("/:id", getOrderById);
// router.put("/:id/status", updateOrderStatus);
// router.delete("/:id/cancel", cancelOrder);
// router.get(
//   "/:customer_id/",
//   //  authmiddleware,
//   getOrdersByCustomer
// );
module.exports = router;
