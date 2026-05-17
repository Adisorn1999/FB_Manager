const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretInput = process.env.APP_CRYPTO_SECRET || process.env.JWT_SECRET;

if (!secretInput) {
  throw new Error("Missing APP_CRYPTO_SECRET (or JWT_SECRET) environment variable");
}

const secret = crypto.createHash("sha256").update(secretInput).digest();
const legacyIv = Buffer.alloc(16, 0);

function encrypt(text) {
  if (!text) return "";

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(text) {
  if (!text) return "";

  if (text.includes(":")) {
    const [ivHex, payload] = text.split(":", 2);
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, secret, iv);
    let decrypted = decipher.update(payload, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  // Legacy fallback for previously stored ciphertext.
  const decipher = crypto.createDecipheriv(algorithm, secret, legacyIv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function hash(text) {
  return crypto.createHash("sha256").update(text || "").digest("hex");
}

module.exports = { encrypt, decrypt, hash };
