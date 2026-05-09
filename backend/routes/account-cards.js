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
// ================= LIST =================
router.get("/account/:id", auth, (req, res) => {

  db.query(
    `
    SELECT
  ac.id as relation_id,
  c.id as card_id,
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
// ================= UPDATE PAYMENT TYPE =================
router.put("/:id/payment-type", auth, (req, res) => {

  const { payment_type } = req.body;

  // หา row ปัจจุบันก่อน
  db.query(
    `
    SELECT *
    FROM account_cards
    WHERE id = ?
    `,
    [req.params.id],
    (err, rows) => {

      if (err) {
        return error(res, "Fetch failed", err);
      }

      if (rows.length === 0) {
        return error(res, "Card not found", null, 404);
      }

      const current = rows[0];

      // ถ้าจะตั้ง main
      if (payment_type === "main") {

        db.query(
          `
          UPDATE account_cards
          SET payment_type = 'backup'
          WHERE account_id = ?
          AND payment_type = 'main'
          `,
          [current.account_id],
          (err2) => {

            if (err2) {
              return error(res, "Update failed", err2);
            }

            // set main ใบใหม่
            db.query(
              `
              UPDATE account_cards
              SET payment_type = ?
              WHERE id = ?
              `,
              [payment_type, req.params.id],
              (err3) => {

                if (err3) {
                  return error(res, "Update failed", err3);
                }

                return success(
                  res,
                  null,
                  "Updated"
                );

              }
            );

          }
        );

      } else {

        // backup / die
        db.query(
          `
          UPDATE account_cards
          SET payment_type = ?
          WHERE id = ?
          `,
          [payment_type, req.params.id],
          (err4) => {

            if (err4) {
              return error(res, "Update failed", err4);
            }

            return success(
              res,
              null,
              "Updated"
            );

          }
        );

      }

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
