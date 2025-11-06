require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');
const cron = require('node-cron');

const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function fetchAndStoreISS() {
  try {
    const { data } = await axios.get(API_URL);
    await pool.query(
      'INSERT INTO iss_telemetry (latitude, longitude, altitude, velocity, timestamp) VALUES ($1, $2, $3, $4, $5)',
      [data.latitude, data.longitude, data.altitude, data.velocity, data.timestamp]
    );
    console.log('Inserted:', data.timestamp);
    const { rows } = await pool.query('SELECT altitude FROM iss_telemetry ORDER BY id DESC LIMIT 1 OFFSET 1');
    if (rows.length > 0) {
      const change = data.altitude - rows[0].altitude;
      if (Math.abs(change) > 0.1) console.log('Change:', change);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

cron.schedule('*/5 * * * * *', fetchAndStoreISS);
console.log('Fetcher running...');