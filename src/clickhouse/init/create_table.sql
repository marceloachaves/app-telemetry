CREATE DATABASE IF NOT EXISTS telemetry;

CREATE TABLE IF NOT EXISTS telemetry.sensor_readings
(
    device_id String NOT NULL,
    value Float64 NOT NULL,
    timestamp DateTime DEFAULT now() NOT NULL
)
ENGINE = MergeTree()
ORDER BY device_id;