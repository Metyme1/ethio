const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.tostring() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        category: product.category_id,
        quantity,
      });
    }
    await cart.save();
    res.satus(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

exports.deleteFromCart = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({
      user: userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() === productId
    );

    await cart.save();
    res.status(200).json({ message: "Item Removed From Cart" });
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart", err });
  }
};

exports.updateCartItem = async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({
      user: userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;

      await cart.save();
      return res
        .status(200)
        .json({ message: "Cart item updated successfully", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating cart item", error });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = Cart.findOne({
      user: userId,
    }).populate("items.product", "name price category_id image_url weight");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
