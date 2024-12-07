const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const User = require("../models/Users");
const Notification = require("../models/Notification");

const createDelivery = async (req, res) => {
  try {
    const {
      order_id,
      user_id,
      delivery_type,
      pickup_address,
      delivery_address,
      weight,
      baseCost,
      costPerKm,
      total_distance,
    } = req.body;

    if (delivery_type === "E-commerce" && (!delivery_address || !weight)) {
      return res.status(400).json({
        message: "Delivery address and weight are required for E-commerce type",
      });
    }
    if (delivery_type === "User-to-User" && !pickup_address) {
      return res
        .status(400)
        .json({ message: "Pickup address is required for User-to-User type" });
    }

    const totalCost = baseCost + costPerKm * total_distance * weight;

    const delivery = new Delivery({
      order_id: delivery_type === "E-commerce" ? order_id : null,
      user_id,
      delivery_type,
      pickup_address,
      delivery_address,
      weight,
      baseCost,
      totalCost,
      costPerKm,
      total_distance,
      status: "pending",
    });

    await delivery.save();

    res
      .status(201)
      .json({ message: "Delivery created successfully", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = status;
    await delivery.save();
    if (status === "delivered" && delivery.delivery_person_id) {
      const deliveryPerson = await User.findById(delivery.delivery_person_id);
      if (deliveryPerson) {
        deliveryPerson.isAvailable = true;
        await deliveryPerson.save();
      }
    }

    const notification = new Notification({
      user_id: delivery.user_id,
      delivery_id: delivery._id,
      status,
      message: `Your delivery status has been updated to: ${status}.`,
    });
    await notification.save();

    const io = req.app.get("socketio");
    io.to(delivery.user_id.toString()).emit("delivery_status_update", {
      delivery_id: delivery._id,
      status,
      message: `Your delivery status has been updated to: ${status}.`,
    });

    res.status(200).json({
      message: "Delivery status updated successfully",
      delivery,
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const assignDeliveryPerson = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { deliveryPersonId } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const deliveryPerson = await User.findOne({
      _id: deliveryPersonId,
      role: "delivery-person",
      isAvailable: true,
    });

    if (!deliveryPerson) {
      return res.status(404).json({
        message: "Delivery person not found or is currently unavailable",
      });
    }

    delivery.delivery_person_id = deliveryPersonId;
    delivery.status = "ongoing";
    await delivery.save();

    deliveryPerson.isAvailable = false;
    await deliveryPerson.save();

    const io = req.app.get("socketio");
    io.to(delivery.user_id.toString()).emit("order_status_update", {
      order_id: delivery.order_id,
      status: "ongoing",
      message:
        "Your order is now assigned to a delivery person and is ongoing.",
    });

    res.status(200).json({
      message: "Delivery person assigned successfully",
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("user_id", "name email")
      .populate("delivery_person_id", "name email")
      .populate("order_id", "orderNumber");

    res.status(200).json({ deliveries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await User.find({ role: "delivery-person" }).select(
      "-password"
    );
    res.status(200).json({ deliveryPersons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDelivery,
  updateDeliveryStatus,
  assignDeliveryPerson,
  getAllDeliveries,
  getAllDeliveryPersons,
};
