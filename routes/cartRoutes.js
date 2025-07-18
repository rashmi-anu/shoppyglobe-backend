// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const { cartItemSchema } = require("../utils/validationSchemas");
const { validate } = require("../middleware/validationMiddleware");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price imageUrl"
    );

    if (cart) {
      res.json(cart);
    } else {
      res.status(200).json({ user: req.user._id, items: [] });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Add a product to the shopping cart
// @route   POST /api/cart
// @access  Private
router.post("/", protect, validate(cartItemSchema), async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.stockQuantity < quantity) {
      res.status(400);
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
      );
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].priceAtAddToCart = product.price;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          priceAtAddToCart: product.price,
        });
      }
    } else {
      cart = new Cart({
        user: req.user._id,
        items: [
          { product: productId, quantity, priceAtAddToCart: product.price },
        ],
      });
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    next(error);
  }
});

// @desc    Update the quantity of a product in the cart
// @route   PUT /api/cart/:productId
// @access  Private
router.put(
  "/:productId",
  protect,
  validate(cartItemSchema),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid Product ID format in URL");
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      if (product.stockQuantity < quantity) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
        );
      }

      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        res.status(404);
        throw new Error("Cart not found for this user");
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].priceAtAddToCart = product.price;

        const updatedCart = await cart.save();
        res.json(updatedCart);
      } else {
        res.status(404);
        throw new Error("Product not found in cart");
      }
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Remove a product from the cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete("/:productId", protect, async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid Product ID format");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found for this user");
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      res.status(404);
      throw new Error("Product not found in cart to remove");
    }

    await cart.save();
    res.json({ message: "Product removed from cart" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
