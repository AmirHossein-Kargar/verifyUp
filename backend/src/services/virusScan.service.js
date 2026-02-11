const fs = require("fs");

/**
 * Placeholder malware scanning hook.
 *
 * In production, integrate this with a real AV engine (e.g. ClamAV,
 * commercial scanning API, or an internal scanning microservice).
 *
 * @param {string} filePath absolute path to the uploaded file on disk
 * @returns {Promise<{ isClean: boolean; reason?: string }>}
 */
async function scanFileForMalware(filePath) {
  if (!filePath) {
    throw new Error("File path is required for malware scan");
  }

  // If the file does not exist anymore, treat as suspicious and block.
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    return {
      isClean: false,
      reason: "فایل در دسترس نیست و نمی‌توان آن را اسکن کرد",
    };
  }

  // TODO: wire in real AV scanner here.
  // For now we optimistically mark the file as clean while still
  // providing a single integration point for future enhancements.
  return {
    isClean: true,
    reason: "اسکن امنیتی فعال نیست (حالت پیش‌فرض)",
  };
}

module.exports = {
  scanFileForMalware,
};
