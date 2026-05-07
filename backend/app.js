const express = require('express');
const cors = require('cors');
const { post } = require('./routes/accounts');
const dotenv = require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/test', require('./routes/test'));
app.use('/accounts', require('./routes/accounts'));
app.use('/pages', require('./routes/pages'));
app.use('/pixels', require('./routes/pixels'));
app.use('/cards', require('./routes/cards'));
app.use('/relations', require('./routes/relations'));
app.use('/account-cards', require('./routes/account-cards'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/account-pages', require('./routes/account-pages'));
app.use('/account-pixels', require('./routes/account-pixels'));
app.get('/', (req, res) => {
  res.send('API RUNNING');
});

app.listen(process.env.DB_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.DB_PORT}`);

});
