const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// 🟢 CREATE RELATION
router.post('/', auth, (req, res) => {
  const { account_id, page_id, pixel_id, status } = req.body;

  if (!account_id) {
    return res.status(400).json({
      success: false,
      message: "account_id required"
    });
  }

  const sql = `
    INSERT INTO account_relations (account_id, page_id, pixel_id, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [account_id, page_id || null, pixel_id || null, status || "active"],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, message: "Relation created" });
    }
  );
});


// 🟢 GET ALL (JOIN แล้ว)
router.get('/', auth, (req, res) => {
  const sql = `
    SELECT 
      r.id,

      a.username,
      a.bm,

      p.page_id,
      p.page_name,
      p.agen,

      px.px_id,
      px.agen1,
      px.agen2,

      r.status

    FROM account_relations r
    LEFT JOIN accounts a ON r.account_id = a.id
    LEFT JOIN pages p ON r.page_id = p.id
    LEFT JOIN pixels px ON r.pixel_id = px.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result
    });
  });
});


// 🔴 DELETE
router.delete('/:id', auth, (req, res) => {
  db.query(
    'DELETE FROM account_relations WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

module.exports = router;