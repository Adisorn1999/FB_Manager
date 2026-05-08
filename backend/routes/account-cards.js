const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { success, error } = require("../utils/response");
const auth = require("../middleware/auth");
router.post("/", auth, (req, res) => {
  const { account_id, card_id } = req.body;

  if (!account_id || !card_id) {
    return error(res, "account_id & card_id required", null, 400);
  }

  db.query(
    "INSERT INTO account_cards (account_id, card_id) VALUES (?, ?)",
    [account_id, card_id],
    (err, result) => {
      if (err?.code === "ER_DUP_ENTRY") {
        return error(res, "Card นี้มีแล้ว ❌", err, 400);
      }

      if (err) return error(res, "Insert failed", err);

      return success(res, { id: result.insertId }, "Card added");
    },
  );
});

router.get("/account/:id", auth, (req, res) => {

  db.query(
    `
    SELECT 
      c.id,
      c.number,
      c.exp,
      c.code,
      ac.payment_type

    FROM account_cards ac

    LEFT JOIN cards c 
      ON ac.card_id = c.id

    WHERE ac.account_id = ?
    `,
    [req.params.id],
    (err, result) => {

      if (err) {
        return error(res, "Fetch failed", err);
      }

      return success(res, result);

    }
  );

});
// ================= DETAIL =================
router.delete("/:id", auth, (req, res) => {
  db.query("DELETE FROM account_cards WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
    });
  });
});
module.exports = router;
