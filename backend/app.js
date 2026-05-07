const express = require('express');
const cors = require('cors');
const { post } = require('./routes/accounts');
const dotenv = require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');

app.use('/auth', authRoutes);
app.use('/test', testRoutes);
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
console.log('accounts:', require('./routes/accounts'));
console.log('pages:', require('./routes/pages'));
console.log('pixels:', require('./routes/pixels'));
console.log('cards:', require('./routes/cards'));
console.log('relations:', require('./routes/relations'));
console.log('accountCards:', require('./routes/account-cards'));
console.log('dashboard:', require('./routes/dashboard'));
console.log('account-pages:', require('./routes/account-pages'));
console.log('account-pixels:', require('./routes/account-pixels'));
console.log(process.env.JWT_SECRET);