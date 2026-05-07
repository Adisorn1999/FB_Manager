const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { success, error } = require('../utils/response');

router.post('/', (req, res) => {
  const { account_id, page_id } = req.body;

  if (!account_id || !page_id) {
    return error(res, 'account_id & page_id required', null, 400);
  }

  db.query(
    'INSERT INTO account_pages (account_id, page_id) VALUES (?, ?)',
    [account_id, page_id],
    (err, result) => {

      if (err?.code === 'ER_DUP_ENTRY') {
        return error(res, 'Page นี้มีแล้ว ❌', err, 400);
      }

      if (err) return error(res, 'Insert failed', err);

      return success(res, { id: result.insertId }, 'Page added');
    }
  );
});

router.get('/account/:id', (req, res) => {
  db.query(
    `SELECT ap.*, p.page_name
     FROM account_pages ap
     LEFT JOIN pages p ON ap.page_id = p.page_id
     WHERE ap.account_id=?`,
    [req.params.id],
    (err, result) => {
      if (err) return error(res, 'Fetch failed', err);
      return success(res, result);
    }
  );
});
// ================= DETAIL =================
router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM account_pages WHERE id = ?',
    [req.params.id],
    (err) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Delete failed',
          error: err
        });
      }

      res.json({
        success: true,
        message: 'Deleted'
      });
    }
  );
});
module.exports = router;