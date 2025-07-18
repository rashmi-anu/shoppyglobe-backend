// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { productSchema } = require("../utils/validationSchemas");
const { validate } = require("../middleware/validationMiddleware");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid Product ID format");
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Create a product (Admin only, assumed for now)
// @route   POST /api/products
// @access  Private/Admin (you'd add 'protect' middleware here for real auth)
router.post("/", validate(productSchema), async (req, res, next) => {
  try {
    const { name, price, description, stockQuantity, imageUrl } = req.body;

    const productExists = await Product.findOne({ name });
    if (productExists) {
      res.status(400);
      throw new Error("Product with this name already exists");
    }

    const product = new Product({
      name,
      price,
      description,
      stockQuantity,
      imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
