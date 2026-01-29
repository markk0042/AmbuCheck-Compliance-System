-- AmbuCheck PostgreSQL schema (also applied automatically by db.js when DATABASE_URL is set)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS runsheets (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_id VARCHAR(100) NOT NULL,
  values JSONB NOT NULL DEFAULT '{}',
  form_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);

CREATE TABLE IF NOT EXISTS equipment_checks (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER
);

CREATE TABLE IF NOT EXISTS form_config_overrides (
  form_id VARCHAR(100) PRIMARY KEY,
  config JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS practitioners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  pin VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'crew',
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  registration VARCHAR(100) NOT NULL,
  callsign VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT ''
);
