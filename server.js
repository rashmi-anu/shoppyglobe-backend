// server.js
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware"); // Correct import for both

const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// General route for testing
app.get("/", (req, res) => {
  res.send("ShoppyGlobe API is running!");
});

// 404 Not Found Middleware (must be before error handler)
app.use(notFound);

// Error Handling Middleware (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
