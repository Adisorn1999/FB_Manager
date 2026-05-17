const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
// =========================
// CREATE
// =========================
router.post("/", auth, (req, res) => {
  const {
    link_name,
    link,
    status = "active",
    remark = "",
  } = req.body;

  if (!link_name || !link) {
    return res.status(400).json({
      success: false,
      message: "link_name and link are required",
    });
  }

  const sql = `
    INSERT INTO links (
      link_name,
      link,
      status,
      remark
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [link_name, link, status, remark],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Link created",
        id: result.insertId,
      });
    }
  );
});

// =========================
// READ ALL
// =========================
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT *
    FROM links
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

// =========================
// READ ONE
// =========================
router.get("/:id", auth, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM links
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    res.json({
      success: true,
      data: results[0],
    });
  });
});

// =========================
// UPDATE
// =========================
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;

  const {
    link_name,
    link,
    status,
    remark,
  } = req.body;

  const sql = `
    UPDATE links
    SET
      link_name = ?,
      link = ?,
      status = ?,
      remark = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      link_name,
      link,
      status,
      remark,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Link updated",
      });
    }
  );
});

// =========================
// DELETE
// =========================
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM links
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Link deleted",
    });
  });
});

module.exports = router;