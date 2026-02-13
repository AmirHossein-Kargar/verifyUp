require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;

function assertEnv(name) {
  if (!process.env[name]) {
    console.error(`❌ Missing required env: ${name}`);
    process.exit(1);
  }
}

// ✅ Ensure critical env vars exist
assertEnv("MONGO_URI");
assertEnv("JWT_SECRET");
assertEnv("JWT_REFRESH_SECRET");

let server;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on :${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err?.message || err);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal) {
  try {
    console.log(`🛑 Received ${signal}. Shutting down...`);

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    // اگر connectDB خودش graceful shutdown گذاشته، همین کافیه.
    // اگر نه، می‌تونی اینجا mongoose.connection.close() هم بزنی.

    process.exit(0);
  } catch (e) {
    console.error("❌ Shutdown error:", e?.message || e);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Crash safety (log and exit - so process manager restarts cleanly)
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown("uncaughtException");
});

start();
