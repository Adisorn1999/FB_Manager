const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { success, error } = require("../utils/response");
const auth = require("../middleware/auth");
router.post("/", auth, (req, res) => {
  const { account_id, px_id } = req.body;

  if (!account_id || !px_id) {
    return error(res, "account_id & px_id required", null, 400);
  }

  db.query(
    "INSERT INTO account_pixels (account_id, px_id) VALUES (?, ?)",
    [account_id, px_id],
    (err, result) => {
      if (err?.code === "ER_DUP_ENTRY") {
        return error(res, "Pixel นี้มีแล้ว ❌", err, 400);
      }

      if (err) return error(res, "Insert failed", err);

      return success(res, { id: result.insertId }, "Pixel added");
    },
  );
});

router.get("/account/:id", auth, (req, res) => {
  db.query(
    `SELECT ap.*, px.agen1, px.agen2
     FROM account_pixels ap
     LEFT JOIN pixels px ON ap.px_id = px.px_id
     WHERE ap.account_id=?`,
    [req.params.id],
    (err, result) => {
      if (err) return error(res, "Fetch failed", err);
      return success(res, result);
    },
  );
});

// ================= DETAIL =================
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM account_pixels WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
        });
      }

      res.json({
        success: true,
      });
    },
  );
});

module.exports = router;
