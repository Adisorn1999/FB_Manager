const express = require('express');
const router = express.Router();
const db = require('../config/db');


// 🟢 CREATE
router.post('/', (req, res) => {
  const { page_id, agen, page_name, status, remark } = req.body;

  if (!page_id) {
    return res.status(400).json({
      success: false,
      message: 'page_id required'
    });
  }

  const sql = `
    INSERT INTO pages (page_id, agen, page_name, status, remark)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [page_id, agen, page_name, status || 'active', remark],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, message: 'Page created' });
    }
  );
});


// 🟢 GET ALL
router.get('/', (req, res) => {
  db.query('SELECT * FROM pages', (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result
    });
  });
});


// 🔍 GET ONE
router.get('/:id', (req, res) => {
  db.query(
    'SELECT * FROM pages WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json({
        success: true,
        data: result[0]
      });
    }
  );
});


// 🟡 UPDATE
router.put('/:id', (req, res) => {
  const { page_id, agen, page_name, status, remark } = req.body;

  const sql = `
    UPDATE pages
    SET page_id=?, agen=?, page_name=?, status=?, remark=?
    WHERE id=?
  `;

  db.query(
    sql,
    [page_id, agen, page_name, status, remark, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, message: 'Page updated' });
    }
  );
});


// 🔴 DELETE (soft)
router.delete('/:id', (req, res) => {
  db.query(
    'UPDATE pages SET status="inactive" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

module.exports = router;