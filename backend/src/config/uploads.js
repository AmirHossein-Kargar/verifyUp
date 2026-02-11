const fs = require("fs");
const path = require("path");

// Centralized uploads directory for all document/file storage.
// Placed outside any static web root; access must go through
// controlled, authenticated download endpoints.
const uploadsDir = path.join(__dirname, "..", "..", "storage", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

module.exports = {
  uploadsDir,
};
