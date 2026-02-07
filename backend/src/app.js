const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const errorMiddleware = require("./middleware/error");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(errorMiddleware);

module.exports = app;
