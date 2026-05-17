const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const slugify = require("slugify");
// =========================
// CREATE
// =========================
router.post("/",auth, (req, res) => {
  const {
    tag_name,
    color = "#3b82f6",
    status = "active",
  } = req.body;

  if (!tag_name) {
    return res.status(400).json({
      success: false,
      message: "tag_name is required",
    });
  }

  // generate slug auto
  const slug = slugify(tag_name, {
    lower: true,
    strict: true,
  });

  const sql = `
    INSERT INTO tags (
      tag_name,
      slug,
      color,
      status
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [tag_name, slug, color, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Tag created",
        slug,
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
    FROM tags
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
    FROM tags
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
        message: "Tag not found",
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
    tag_name,
    slug,
    color,
    status,
    remark,
  } = req.body;

  const sql = `
    UPDATE tags
    SET
      tag_name = ?,
      slug = ?,
      color = ?,
      status = ?,
      remark = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      tag_name,
      slug,
      color,
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
        message: "Tag updated",
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
    DELETE FROM tags
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
      message: "Tag deleted",
    });
  });
});

module.exports = router;