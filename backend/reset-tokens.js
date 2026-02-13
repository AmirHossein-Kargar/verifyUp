// Temporary script to reset all user tokenVersions to 0
// Run this with: node reset-tokens.js

require("dotenv").config();
const mongoose = require("mongoose");

async function resetTokenVersions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await mongoose.connection.db
      .collection("users")
      .updateMany({}, { $set: { tokenVersion: 0 } });

    console.log(`✅ Reset tokenVersion for ${result.modifiedCount} users`);

    await mongoose.connection.close();
    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

resetTokenVersions();
