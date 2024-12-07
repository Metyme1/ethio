const express = require("express");
const {
  createDelivery,
  updateDeliveryStatus,
  assignDeliveryPerson,
  getAllDeliveries,
  getAllDeliveryPersons,
} = require("../controllers/deliveryController");

const authMiddleware = require("../middlewares/authmiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/delivery-persons",
  // authMiddleware,
  // roleMiddleware(["admin", "call-person"]),
  getAllDeliveryPersons
);

router.post("/deliveries", authMiddleware, createDelivery);

router.put(
  "/deliveries/:deliveryId/status",
  authMiddleware,
  roleMiddleware(["admin", "call-person"]),
  updateDeliveryStatus
);

router.put(
  "/deliveries/:deliveryId/assign",
  authMiddleware,
  roleMiddleware(["admin", "call-person"]),
  assignDeliveryPerson
);

router.get(
  "/deliveries",
  authMiddleware,
  roleMiddleware(["admin", "call-person"]),
  getAllDeliveries
);

module.exports = router;
