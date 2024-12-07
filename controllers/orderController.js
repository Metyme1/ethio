const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

exports.createOrAddToOrder = async (req, res) => {
  try {
    const {
      customer_id,
      order_items,
      order_type,
      text_on_delivery,
      delivery_date,
    } = req.body;

    // Find an existing pending order for the customer
    let order = await Order.findOne({
      customer_id,
      delivery_status: "pending",
    });

    let total_price = 0;
    const orderItemPromises = order_items.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      const itemPrice = product.price * item.quantity;
      total_price += itemPrice;

      return new OrderItem({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
    });

    const savedOrderItems = await Promise.all(orderItemPromises);

    if (order) {
      // If a pending order exists, add new items to it
      order.total_price += total_price;
      order.order_items.push(...savedOrderItems.map((item) => item._id));
    } else {
      // Create a new order if no pending order exists
      order = new Order({
        customer_id,
        total_price,
        order_type,
        text_on_delivery,
        delivery_date,
        order_items: savedOrderItems.map((item) => item._id),
      });
    }

    await order.save();

    // Update order_id in each order item
    for (const orderItem of savedOrderItems) {
      orderItem.order_id = order._id;
      await orderItem.save();
    }

    res.status(201).json({
      message: "Order created/updated successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating or updating order",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.delivery_status = status;
    }

    const orders = await Order.find(query)
      .populate("customer_id", "name phone")
      .populate({
        path: "order_items",
        populate: {
          path: "product_id",
          select: "name price",
        },
      });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { cancellation_reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      ["delivered", "confirmed", "out-for-delivery"].includes(
        order.delivery_status
      )
    ) {
      return res.status(400).json({
        message: "Order cannot be canceled as it is already processed",
      });
    }

    order.delivery_status = "canceled";
    order.cancellation_reason = cancellation_reason || "No reason provided";
    await order.save();

    res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error canceling order", error: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { status } = req.query;
    let query = { customer_id };

    if (status) {
      query.delivery_status = status;
    }

    const orders = await Order.find(query)
      .populate("customer_id", "name phone")
      .populate({
        path: "order_items",
        populate: {
          path: "product_id",
          select: "name price",
        },
      });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer orders", error });
  }
};
