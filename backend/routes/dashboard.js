const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {

  const sql = `
    SELECT *
    FROM accounts
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result
    });
  });
});

module.exports = router;