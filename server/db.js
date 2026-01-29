/**
 * Data layer: PostgreSQL when DATABASE_URL is set, otherwise JSON files in server/data.
 * All methods return Promises so the server can use async/await regardless of backend.
 */
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
const useDb = Boolean(process.env.DATABASE_URL);

let pool = null;

function getDataFile(filename) {
  return path.join(dataDir, filename);
}

function readJSON(filename, defaultValue = []) {
  const filePath = getDataFile(filename);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function writeJSON(filename, data) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const filePath = getDataFile(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function init() {
  if (!useDb) return;
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Render and most hosted Postgres require SSL in production
    ssl: process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
      ? { rejectUnauthorized: false }
      : false,
  });
  const client = await pool.connect();
  try {
    await client.query(`
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
    `);
  } finally {
    client.release();
  }
}

async function getUsers() {
  if (useDb) {
    const r = await pool.query('SELECT id, username, password, role, name FROM users ORDER BY id');
    return r.rows;
  }
  return readJSON('users.json', []);
}

async function setUsers(users) {
  if (useDb) {
    await pool.query('DELETE FROM users');
    for (const u of users) {
      await pool.query(
        'INSERT INTO users (id, username, password, role, name) VALUES ($1, $2, $3, $4, $5)',
        [u.id, u.username, u.password, u.role || 'user', u.name || null]
      );
    }
    const maxId = users.length ? Math.max(...users.map(u => u.id)) : 1;
    await pool.query("SELECT setval(pg_get_serial_sequence('users', 'id'), $1)", [maxId]);
    return;
  }
  writeJSON('users.json', users);
}

async function findUserByUsername(username) {
  if (useDb) {
    const r = await pool.query('SELECT id, username, password, role, name FROM users WHERE username = $1', [username]);
    return r.rows[0] || null;
  }
  const users = readJSON('users.json', []);
  return users.find(u => u.username === username) || null;
}

async function getRunsheets() {
  if (useDb) {
    const r = await pool.query('SELECT id, data FROM runsheets ORDER BY id');
    return r.rows.map(row => ({ id: row.id, ...row.data }));
  }
  return readJSON('runsheets.json', []);
}

async function setRunsheets(runsheets) {
  if (useDb) {
    await pool.query('DELETE FROM runsheets');
    for (const rs of runsheets) {
      const { id, ...data } = rs;
      await pool.query('INSERT INTO runsheets (id, data) VALUES ($1, $2)', [id, JSON.stringify(data)]);
    }
    await pool.query("SELECT setval(pg_get_serial_sequence('runsheets', 'id'), (SELECT COALESCE(MAX(id), 1) FROM runsheets))");
    return;
  }
  writeJSON('runsheets.json', runsheets);
}

async function getFormSubmissions(formId) {
  if (useDb) {
    const r = await pool.query(
      'SELECT id, form_id, values, form_snapshot, created_at, created_by FROM form_submissions WHERE form_id = $1 ORDER BY id',
      [formId]
    );
    return r.rows.map(row => ({
      id: row.id,
      formId: row.form_id,
      values: row.values || {},
      formSnapshot: row.form_snapshot || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      createdBy: row.created_by,
    }));
  }
  return readJSON(`form-${formId}-submissions.json`, []);
}

async function addFormSubmission(formId, submission) {
  if (useDb) {
    const r = await pool.query(
      `INSERT INTO form_submissions (form_id, values, form_snapshot, created_by)
       VALUES ($1, $2, $3, $4) RETURNING id, form_id, values, form_snapshot, created_at, created_by`,
      [formId, JSON.stringify(submission.values || {}), submission.formSnapshot ? JSON.stringify(submission.formSnapshot) : null, submission.createdBy]
    );
    const row = r.rows[0];
    return {
      id: row.id,
      formId: row.form_id,
      values: row.values || {},
      formSnapshot: row.form_snapshot || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      createdBy: row.created_by,
    };
  }
  const filename = `form-${formId}-submissions.json`;
  const submissions = readJSON(filename, []);
  const newId = submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1;
  const newSubmission = { id: newId, formId, ...submission };
  submissions.push(newSubmission);
  writeJSON(filename, submissions);
  return newSubmission;
}

async function getFormSubmissionById(formId, submissionId) {
  if (useDb) {
    const r = await pool.query(
      'SELECT id, form_id, values, form_snapshot, created_at, created_by FROM form_submissions WHERE form_id = $1 AND id = $2',
      [formId, submissionId]
    );
    if (!r.rows[0]) return null;
    const row = r.rows[0];
    return {
      id: row.id,
      formId: row.form_id,
      values: row.values || {},
      formSnapshot: row.form_snapshot || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      createdBy: row.created_by,
    };
  }
  const submissions = await getFormSubmissions(formId);
  return submissions.find(s => s.id === parseInt(submissionId, 10)) || null;
}

async function getEquipmentChecks() {
  if (useDb) {
    const r = await pool.query('SELECT id, data, created_at, created_by FROM equipment_checks ORDER BY id');
    return r.rows.map(row => ({
      id: row.id,
      ...row.data,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      createdBy: row.created_by,
    }));
  }
  return readJSON('equipment-checks.json', []);
}

async function addEquipmentCheck(check) {
  if (useDb) {
    const { id, createdAt, createdBy, ...data } = check;
    const r = await pool.query(
      'INSERT INTO equipment_checks (data, created_by) VALUES ($1, $2) RETURNING id, data, created_at, created_by',
      [JSON.stringify(data), createdBy]
    );
    const row = r.rows[0];
    return {
      id: row.id,
      ...row.data,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      createdBy: row.created_by,
    };
  }
  const checks = readJSON('equipment-checks.json', []);
  const newId = checks.length > 0 ? Math.max(...checks.map(c => c.id)) + 1 : 1;
  const newCheck = { id: newId, ...check };
  checks.push(newCheck);
  writeJSON('equipment-checks.json', checks);
  return newCheck;
}

async function getEquipmentCheckById(id) {
  if (useDb) {
    const r = await pool.query('SELECT id, data, created_at, created_by FROM equipment_checks WHERE id = $1', [id]);
    if (!r.rows[0]) return null;
    const row = r.rows[0];
    return { id: row.id, ...row.data, createdAt: row.created_at ? new Date(row.created_at).toISOString() : null, createdBy: row.created_by };
  }
  const checks = await getEquipmentChecks();
  return checks.find(c => c.id === parseInt(id, 10)) || null;
}

async function deleteEquipmentCheck(id) {
  if (useDb) {
    const r = await pool.query('DELETE FROM equipment_checks WHERE id = $1', [id]);
    return r.rowCount > 0;
  }
  const checks = readJSON('equipment-checks.json', []);
  const filtered = checks.filter(c => c.id !== parseInt(id, 10));
  if (filtered.length === checks.length) return false;
  writeJSON('equipment-checks.json', filtered);
  return true;
}

async function getFormConfigOverrides() {
  if (useDb) {
    const r = await pool.query('SELECT form_id, config FROM form_config_overrides');
    const out = {};
    r.rows.forEach(row => { out[row.form_id] = row.config; });
    return out;
  }
  return readJSON('form-config-overrides.json', {});
}

async function setFormConfigOverride(formId, config) {
  if (useDb) {
    await pool.query(
      'INSERT INTO form_config_overrides (form_id, config) VALUES ($1, $2) ON CONFLICT (form_id) DO UPDATE SET config = $2',
      [formId, JSON.stringify(config)]
    );
    return;
  }
  const all = readJSON('form-config-overrides.json', {});
  all[formId] = config;
  writeJSON('form-config-overrides.json', all);
}

async function getPractitioners() {
  if (useDb) {
    const r = await pool.query('SELECT id, name, pin, role, active FROM practitioners ORDER BY id');
    return r.rows;
  }
  return readJSON('practitioners.json', []);
}

async function addPractitioner(p) {
  if (useDb) {
    const r = await pool.query(
      'INSERT INTO practitioners (name, pin, role, active) VALUES ($1, $2, $3, $4) RETURNING id, name, pin, role, active',
      [p.name, p.pin, p.role || 'crew', p.active !== false]
    );
    return r.rows[0];
  }
  const list = readJSON('practitioners.json', []);
  const newId = list.length > 0 ? Math.max(...list.map(x => x.id || 0)) + 1 : 1;
  const newP = { id: newId, name: p.name, pin: p.pin, role: p.role || 'crew', active: p.active !== false };
  list.push(newP);
  writeJSON('practitioners.json', list);
  return newP;
}

async function updatePractitioner(id, updates) {
  if (useDb) {
    const r = await pool.query(
      'UPDATE practitioners SET name = COALESCE($2, name), pin = COALESCE($3, pin), role = COALESCE($4, role), active = COALESCE($5, active) WHERE id = $1 RETURNING id, name, pin, role, active',
      [id, updates.name, updates.pin, updates.role, updates.active]
    );
    return r.rows[0] || null;
  }
  const list = readJSON('practitioners.json', []);
  const idx = list.findIndex(x => x.id === parseInt(id, 10));
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, id: list[idx].id };
  writeJSON('practitioners.json', list);
  return list[idx];
}

async function deletePractitioner(id) {
  if (useDb) {
    const r = await pool.query('DELETE FROM practitioners WHERE id = $1 RETURNING id', [id]);
    return r.rowCount > 0;
  }
  const list = readJSON('practitioners.json', []);
  const filtered = list.filter(p => p.id !== parseInt(id, 10));
  if (filtered.length === list.length) return false;
  writeJSON('practitioners.json', filtered);
  return true;
}

async function getVehicles() {
  if (useDb) {
    const r = await pool.query('SELECT id, registration, callsign, description FROM vehicles ORDER BY id');
    return r.rows;
  }
  return readJSON('vehicles.json', []);
}

async function addVehicle(v) {
  if (useDb) {
    const r = await pool.query(
      'INSERT INTO vehicles (registration, callsign, description) VALUES ($1, $2, $3) RETURNING id, registration, callsign, description',
      [v.registration, v.callsign || '', v.description || '']
    );
    return r.rows[0];
  }
  const list = readJSON('vehicles.json', []);
  const newId = list.length > 0 ? Math.max(...list.map(x => x.id || 0)) + 1 : 1;
  const newV = { id: newId, registration: v.registration, callsign: v.callsign || '', description: v.description || '' };
  list.push(newV);
  writeJSON('vehicles.json', list);
  return newV;
}

async function updateVehicle(id, updates) {
  if (useDb) {
    const r = await pool.query(
      'UPDATE vehicles SET registration = COALESCE($2, registration), callsign = COALESCE($3, callsign), description = COALESCE($4, description) WHERE id = $1 RETURNING id, registration, callsign, description',
      [id, updates.registration, updates.callsign, updates.description]
    );
    return r.rows[0] || null;
  }
  const list = readJSON('vehicles.json', []);
  const idx = list.findIndex(x => x.id === parseInt(id, 10));
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, id: list[idx].id };
  writeJSON('vehicles.json', list);
  return list[idx];
}

async function deleteVehicle(id) {
  if (useDb) {
    const r = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);
    return r.rowCount > 0;
  }
  const list = readJSON('vehicles.json', []);
  const filtered = list.filter(v => v.id !== parseInt(id, 10));
  if (filtered.length === list.length) return false;
  writeJSON('vehicles.json', filtered);
  return true;
}

module.exports = {
  useDb,
  init,
  getUsers,
  setUsers,
  findUserByUsername,
  getRunsheets,
  setRunsheets,
  getFormSubmissions,
  addFormSubmission,
  getFormSubmissionById,
  deleteFormSubmission,
  getEquipmentChecks,
  addEquipmentCheck,
  getEquipmentCheckById,
  deleteEquipmentCheck,
  getFormConfigOverrides,
  setFormConfigOverride,
  getPractitioners,
  addPractitioner,
  updatePractitioner,
  deletePractitioner,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};
