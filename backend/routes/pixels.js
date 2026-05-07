const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/crypto');


// 🟢 CREATE
router.post('/', (req, res) => {
  const { px_id, agen1, agen2, token, status } = req.body;

  if (!px_id) {
    return res.status(400).json({
      success: false,
      message: 'px_id required'
    });
  }

  const encryptedToken = encrypt(token || '');

  const sql = `
    INSERT INTO pixels (px_id, agen1, agen2, token, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [px_id, agen1, agen2, encryptedToken, status || 'active'],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, message: 'Pixel created' });
    }
  );
});


// 🟢 GET ALL (❗ไม่โชว์ token)
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM pixels',
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        data: result
      });
    }
  );
});


// 🔍 GET ONE (decrypt token)
router.get('/:id', (req, res) => {
  db.query(
    'SELECT * FROM pixels WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pixel not found'
        });
      }

      const px = result[0];

      try {
        px.token = decrypt(px.token);
      } catch {
        px.token = 'ERROR';
      }

      res.json({
        success: true,
        data: px
      });
    }
  );
});


// 🟡 UPDATE
router.put('/:id', (req, res) => {
  const { px_id, agen1, agen2, token, status } = req.body;

  const encryptedToken = token ? encrypt(token) : null;

  const sql = `
    UPDATE pixels
    SET 
      px_id=?,
      agen1=?,
      agen2=?,
      token=COALESCE(?, token),
      status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [px_id, agen1, agen2, encryptedToken, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, message: 'Pixel updated' });
    }
  );
});


// 🔴 DELETE (soft)
router.delete('/:id', (req, res) => {
  db.query(
    'UPDATE pixels SET status="inactive" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

module.exports = router;