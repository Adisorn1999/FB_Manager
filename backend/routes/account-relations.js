const express = require('express');
const router = express.Router();
const db = require('../config/db');


// ==============================
// ➕ CREATE (ADD PAGE / PIXEL)
// ==============================
router.post('/', (req, res) => {
  const { account_id, page_id, pixel_id } = req.body;

  // ❌ validate
  if (!account_id) {
    return res.status(400).json({
      success: false,
      message: 'account_id required'
    });
  }

  if (!page_id && !pixel_id) {
    return res.status(400).json({
      success: false,
      message: 'page_id or pixel_id required'
    });
  }

  // 🔥 check duplicate
  const checkSql = `
    SELECT id FROM account_relations
    WHERE account_id=?
    AND (
      (page_id IS NOT NULL AND page_id=?)
      OR
      (pixel_id IS NOT NULL AND pixel_id=?)
    )
    LIMIT 1
  `;

  db.query(
    checkSql,
    [account_id, page_id || null, pixel_id || null],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate ❌'
        });
      }

      // 🔥 insert
      const insertSql = `
        INSERT INTO account_relations
        (account_id, page_id, pixel_id, status)
        VALUES (?, ?, ?, 'active')
      `;

      db.query(
        insertSql,
        [account_id, page_id || null, pixel_id || null],
        (err2, result2) => {

          // 🔥 กันซ้ำระดับ DB (สำคัญ)
          if (err2 && err2.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              success: false,
              message: 'Duplicate (DB) ❌'
            });
          }

          if (err2) return res.status(500).json(err2);

          res.json({
            success: true,
            id: result2.insertId
          });
        }
      );
    }
  );
});


// ==============================
// 📄 GET ALL (LIST)
// ==============================
router.get('/', (req, res) => {

  const sql = `
    SELECT 
      ar.id,
      ar.account_id,
      ar.page_id,
      ar.pixel_id,
      ar.status,
      ar.created_at,

      a.username,
      a.bm,

      p.page_name,
      px.agen1,
      px.agen2

    FROM account_relations ar
    LEFT JOIN accounts a ON ar.account_id = a.id
    LEFT JOIN pages p ON ar.page_id = p.page_id
    LEFT JOIN pixels px ON ar.pixel_id = px.px_id

    ORDER BY ar.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      data: result
    });
  });
});


// ==============================
// 🔍 GET BY ACCOUNT
// ==============================
router.get('/account/:account_id', (req, res) => {

  const sql = `
    SELECT *
    FROM account_relations
    WHERE account_id=?
    ORDER BY id DESC
  `;

  db.query(
    sql,
    [req.params.account_id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        data: result
      });
    }
  );
});


// ==============================
// ✏️ UPDATE STATUS
// ==============================
router.put('/:id', (req, res) => {

  const { status } = req.body;

  db.query(
    `UPDATE account_relations SET status=? WHERE id=?`,
    [status || 'active', req.params.id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: 'Updated'
      });
    }
  );
});


// ==============================
// ❌ DELETE (SOFT)
// ==============================
router.delete('/:id', (req, res) => {

  db.query(
    `UPDATE account_relations SET status='inactive' WHERE id=?`,
    [req.params.id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: 'Removed'
      });
    }
  );
});


module.exports = router;