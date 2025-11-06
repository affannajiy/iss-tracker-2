CREATE TABLE iss_telemetry (
  id SERIAL PRIMARY KEY,
  latitude FLOAT,
  longitude FLOAT,
  altitude FLOAT,
  velocity FLOAT,
  timestamp BIGINT,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_timestamp ON iss_telemetry (timestamp);