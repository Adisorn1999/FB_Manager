const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const auth = require("../middleware/auth");


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

// ================= UPDATE USER =================
router.put("/users/:id", auth, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { username, password, role, status } = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    if (role && !["admin", "staff"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (status && !["active", "disabled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const fields = [];
    const values = [];

    if (username !== undefined) {
      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Username is required",
        });
      }

      fields.push("username = ?");
      values.push(username);
    }

    if (password !== undefined) {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }

      const hash = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hash);
    }

    if (role !== undefined) {
      fields.push("role = ?");
      values.push(role);
    }

    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(userId);

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "Username already exists",
          });
        }

        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Update user success",
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
