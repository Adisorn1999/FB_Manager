const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
router.post("/", (req, res) => {
  const { number, exp, code } = req.body;

  db.query(
    "INSERT INTO cards (number, exp, code) VALUES (?, ?, ?)",
    [number, exp, code],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    },
  );
});

router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM cards", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, data: result });
  });
});

// GET ONE CARD
router.get("/:id", auth, (req, res) => {
  db.query("SELECT * FROM cards WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      success: true,
      data: result[0],
    });
  });
});
// UPDATE CARD
router.put("/:id", auth, (req, res) => {
  const { number, exp, code, status, remark } = req.body;

  const sql = `
    UPDATE cards
    SET number=?, exp=?, code=?, status=?, remark=?
    WHERE id=?
  `;

  db.query(sql, [number, exp, code, status, remark, req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      message: "Updated",
    });
  });
});

router.delete("/:id", auth, (req, res) => {
  db.query(
    'UPDATE cards SET status="inactive" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    },
  );
});

module.exports = router;
