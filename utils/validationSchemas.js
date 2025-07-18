// utils/validationSchemas.js
const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Product name is required",
    "any.required": "Product name is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  stockQuantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock quantity must be a number",
    "number.integer": "Stock quantity must be an integer",
    "number.min": "Stock quantity cannot be negative",
    "any.required": "Stock quantity is required",
  }),
  imageUrl: Joi.string().uri().allow("").optional(),
});

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const cartItemSchema = Joi.object({
  productId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/, "MongoDB ObjectId")
    .messages({
      "string.pattern.name": "Product ID must be a valid MongoDB ObjectId",
      "string.empty": "Product ID is required",
      "any.required": "Product ID is required",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
});

module.exports = {
  productSchema,
  registerSchema,
  loginSchema,
  cartItemSchema,
};
