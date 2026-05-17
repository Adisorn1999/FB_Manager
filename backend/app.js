const express = require("express");
const cors = require("cors");
const { post } = require("./routes/accounts");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth"));
app.use("/test", require("./routes/test"));
app.use("/accounts", require("./routes/accounts"));
app.use("/pages", require("./routes/pages"));
app.use("/pixels", require("./routes/pixels"));
app.use("/cards", require("./routes/cards"));
app.use("/relations", require("./routes/relations"));
app.use("/account-cards", require("./routes/account-cards"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/account-pages", require("./routes/account-pages"));
app.use("/account-pixels", require("./routes/account-pixels"));
app.use("/links", require("./routes/links"));
app.use("/tags", require("./routes/tags"));
app.use("/link-tags", require("./routes/link-tag"));
app.get("/", (req, res) => {
  res.send("API RUNNING");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER RUNNING ${PORT}`);
});
