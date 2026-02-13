const mongoose = require("mongoose");

async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  // Useful mongoose options for production stability
  const opts = {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 20),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 0),
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
    connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
    appName: process.env.APP_NAME || "verifyup-api",
  };

  // Connection event logging
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err?.message || err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    try {
      console.log(`🛑 Received ${signal}, closing MongoDB connection...`);
      await mongoose.connection.close();
      process.exit(0);
    } catch (e) {
      console.error("❌ Error closing MongoDB connection:", e?.message || e);
      process.exit(1);
    }
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  await mongoose.connect(uri, opts);
}

module.exports = connectDB;
