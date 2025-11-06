require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ /* same as above */ });

async function compute() {
  const { rows: lon } = await pool.query('SELECT MAX(longitude) max_lon, MIN(longitude) min_lon FROM iss_telemetry');
  console.log('Lon:', lon[0]);

  const { rows: alt } = await pool.query('SELECT altitude, LAG(altitude) OVER (ORDER BY timestamp) prev FROM iss_telemetry');
  const changes = alt.filter(r => r.prev !== null).map(r => r.altitude - r.prev);
  console.log('Changes:', changes);
}

compute();