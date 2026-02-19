/**
 * AES-256-GCM encryption for profile images.
 * Requires IMAGE_ENCRYPTION_KEY (32-byte hex or 32-character string) in env.
 */

const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey() {
  const raw = process.env.IMAGE_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error("IMAGE_ENCRYPTION_KEY must be set and at least 32 characters");
  }
  if (Buffer.isBuffer(raw)) return raw;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  return crypto.createHash("sha256").update(raw).digest();
}

/**
 * Encrypt a buffer. Returns { encrypted, iv, authTag }.
 */
function encrypt(buffer) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted, iv, authTag };
}

/**
 * Coerce to Buffer (handles Mongoose lean format { type: 'Buffer', data: [...] }).
 */
function toBuffer(v) {
  if (Buffer.isBuffer(v)) return v;
  if (v && typeof v === "object" && Array.isArray(v.data)) return Buffer.from(v.data);
  return Buffer.from(v || []);
}

/**
 * Decrypt with iv and authTag. Returns original buffer.
 * Accepts Buffer or lean-style { type, data } for all arguments.
 */
function decrypt(encrypted, iv, authTag) {
  const key = getKey();
  const enc = toBuffer(encrypted);
  const ivBuf = toBuffer(iv);
  const tagBuf = toBuffer(authTag);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuf, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(tagBuf);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}

module.exports = { encrypt, decrypt, getKey };
