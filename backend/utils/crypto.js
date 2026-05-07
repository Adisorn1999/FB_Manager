const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secret = crypto.createHash('sha256').update('my-secret-key').digest();
const iv = Buffer.alloc(16, 0);

// 🔐 encrypt
function encrypt(text) {
  if (!text) return '';
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 🔓 decrypt
function decrypt(text) {
  if (!text) return '';
  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 🔑 hash (ใช้ตรวจซ้ำ)
function hash(text) {
  return crypto.createHash('sha256').update(text || '').digest('hex');
}

module.exports = { encrypt, decrypt, hash };