const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { encrypt, decrypt, hash } = require("../utils/crypto");
const auth = require("../middleware/auth");
// =========================
// 🟢 CREATE ACCOUNT
// =========================
router.post("/", auth, (req, res) => {
  const {
    username,
    password,
    secret_code,
    email,
    email_password,
    temp_mail,
    bm,
    status,
    remark
  } = req.body;

  const passwordHash = hash(password || "");
  const emailPasswordHash = hash(email_password || "");

  const sql = `
    INSERT INTO accounts
    (username, password, password_hash, secret_code, email, email_password, email_password_hash, temp_mail, bm, status, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      username,
      encrypt(password || ""),
      passwordHash,
      encrypt(secret_code || ""),
      email,
      encrypt(email_password || ""),
      emailPasswordHash,
      temp_mail,
      bm,
      status || "active",
      remark ,
    ],
    (err) => {
      if (err) {
        // 🔥 สำคัญมาก (จับ duplicate จาก MySQL)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "DUPLICATE",
          });
        }

        console.log(err);
        return res.status(500).json({
          message: "INSERT_ERROR",
        });
      }

      res.json({ success: true });
    },
  );
});
// =========================
// 🟡 CHECK DUPLICATE (ก่อนบันทึก)
router.post("/check-duplicate", auth, (req, res) => {
  const {
    username,
    password,
    secret_code,
    email,
    email_password,
    bm,
    id,// เผื่อใช้ตอน edit (กันชนตัวเอง)
    remark
   
  } = req.body;

  const passwordHash = hash(password || "");
  const emailPasswordHash = hash(email_password || "");

  const sql = `
    SELECT id FROM accounts
    WHERE 
      username = ?
      AND password_hash = ?
      AND secret_code = ?
      AND email = ?
      AND email_password_hash = ?
      AND bm = ?
      ${id ? "AND id != ?" : ""}
      AND remark = ?
    LIMIT 1
  `;

  const params = [
    username,
    passwordHash,
    secret_code || "",
    email,
    emailPasswordHash,
    bm,
    "active",
    remark // Assuming "active" is the default value for remark
  ];

  if (id) params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "DB_ERROR" });

    res.json({
      duplicate: result.length > 0,
    });
  });
});

// =========================
// 🟢 GET ALL
// =========================
router.get("/", auth, (req, res) => {
  const { status, search } = req.query;

  let sql = "SELECT * FROM accounts WHERE 1=1";
  const params = [];

  if (status && status !== "all") {
    sql += " AND status = ?";
    params.push(status);
  }

  if (search) {
    sql += ` AND (
      username LIKE ?
      OR email LIKE ?
      OR bm LIKE ?
    )`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result,
    });
  });
});

// =========================
// 🔍 GET ONE (decrypt)
// =========================
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT * FROM accounts WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      const acc = result[0];

      try {
        acc.password = decrypt(acc.password);
        acc.secret_code = decrypt(acc.secret_code);
        acc.email_password = decrypt(acc.email_password);
      } catch {
        acc.password = "ERROR";
        acc.secret_code = "ERROR";
        acc.email_password = "ERROR";
      }

      res.json({
        success: true,
        data: acc,
      });
    },
  );
});

// =========================
// 🟡 UPDATE
// =========================
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;

  const {
    username,
    password,
    secret_code,
    email,
    email_password,
    temp_mail,
    bm,
    status,
    remark
  } = req.body;

  const sql = `
    UPDATE accounts
    SET 
      username=?,
      password=?,
      password_hash=?,
      secret_code=?,
      email=?,
      email_password=?,
      email_password_hash=?,
      temp_mail=?,
      bm=?,
      status=?,
      remark=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      username,
      encrypt(password || ""),
      hash(password || ""),
      encrypt(secret_code || ""),
      email,
      encrypt(email_password || ""),
      hash(email_password || ""),
      temp_mail,
      bm,
      status || "active",
      remark  ,
      id,
    ],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "DUPLICATE",
          });
        }

        return res.status(500).json(err);
      }

      res.json({ success: true });
    },
  );
});

// =========================
// 🔴 DELETE
// =========================
router.delete("/:id", auth, (req, res) => {
  db.query(
    'UPDATE accounts SET status="inactive" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    },
  );
});

module.exports = router;
