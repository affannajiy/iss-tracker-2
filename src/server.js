require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(express.static('public'));

app.get('/latest', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM iss_telemetry ORDER BY timestamp DESC LIMIT 1');
  res.json(rows[0] || {});
});

app.listen(port, () => console.log(`http://localhost:${port}`));