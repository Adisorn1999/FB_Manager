const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =========================
// CREATE
// =========================
router.post("/", (req, res) => {
  const {
    link_id,
    tag_id,
  } = req.body;

  if (!link_id || !tag_id) {
    return res.status(400).json({
      success: false,
      message: "link_id and tag_id are required",
    });
  }

  const sql = `
    INSERT INTO link_tags (
      link_id,
      tag_id
    )
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [link_id, tag_id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Relation created",
        id: result.insertId,
      });
    }
  );
});

// =========================
// READ ALL
// =========================
router.get("/", (req, res) => {
  const sql = `
    SELECT
      lt.id,
      lt.link_id,
      l.link_name,
      lt.tag_id,
      t.tag_name,
      lt.created_at
    FROM link_tags lt
    LEFT JOIN links l
      ON lt.link_id = l.id
    LEFT JOIN tags t
      ON lt.tag_id = t.id
    ORDER BY lt.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    return res.json({
      success: true,
      data: results,
    });
  });
});

// =========================
// READ ONE
// =========================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      lt.id,
      lt.link_id,
      l.link_name,
      lt.tag_id,
      t.tag_name
    FROM link_tags lt
    LEFT JOIN links l
      ON lt.link_id = l.id
    LEFT JOIN tags t
      ON lt.tag_id = t.id
    WHERE lt.id = ?
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
        message: "Relation not found",
      });
    }

    return res.json({
      success: true,
      data: results[0],
    });
  });
});

// =========================
// UPDATE
// =========================
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    link_id,
    tag_id,
  } = req.body;

  const sql = `
    UPDATE link_tags
    SET
      link_id = ?,
      tag_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [link_id, tag_id, id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      return res.json({
        success: true,
        message: "Relation updated",
      });
    }
  );
});

// =========================
// DELETE
// =========================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM link_tags
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

    return res.json({
      success: true,
      message: "Relation deleted",
    });
  });
});

module.exports = router;