require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({ /* same */ });

app.use(express.static('public'));

app.get('/latest', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM iss_telemetry ORDER BY timestamp DESC LIMIT 1');
  res.json(rows[0] || {});
});

app.listen(port, () => console.log(`http://localhost:${port}`));