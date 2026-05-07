const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');

app.use('/auth', authRoutes);
app.use('/test', testRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});