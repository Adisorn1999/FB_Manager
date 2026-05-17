const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        username,
        password,
        role
      )
      VALUES (?, ?, ?)
    `;

    db.query(sql, [username, hash, "staff"], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "Username already exists",
          });
        }

        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Register success",
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT *
    FROM users
    WHERE username = ?
    LIMIT 1
  `;

  db.query(sql, [username], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result[0];

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User disabled",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  });
});

module.exports = router;
