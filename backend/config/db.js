const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("MYSQL CONNECTION ERROR", err);
    return;
  }

  connection.release();
  console.log("MYSQL CONNECTED");
});

module.exports = db;
