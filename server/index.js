const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const db = require('./db');
const storage = require('./storage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
// JWT secret used to sign authentication tokens.
// For production, ALWAYS set process.env.JWT_SECRET in your hosting provider.
// Changing this value will immediately invalidate all existing tokens.
const JWT_SECRET = process.env.JWT_SECRET || 'ambucheck_jwt_secret_2026_01_28';

// Default admin password (used for initialisation and one-time migration).
// In production, prefer setting ADMIN_DEFAULT_PASSWORD as an environment variable.
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin1994';

// Middleware - CORS must be first
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Capacitor apps, or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow Capacitor app origins (capacitor://localhost, etc.)
    if (origin.startsWith('capacitor://') || origin === 'capacitor://localhost') {
      return callback(null, true);
    }
    
    // Allow HTTP localhost for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // Allow HTTPS localhost (seen from Android WebView as https://localhost)
    if (origin.startsWith('https://localhost')) {
      return callback(null, true);
    }
    
    // Allow all Vercel preview and production deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Check explicit allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject other origins
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Allow larger JSON payloads for form submissions (formSnapshot can be big)
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const multerDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: multerDiskStorage });

// Hash for standard test user password "1user" (bcrypt, 10 rounds)
const USER1_PASSWORD_HASH = '$2a$10$CeVEXdq1SU6MT7CaNwrh9uBM2HfSERgJ7MalRtCz1gB0K8DtZBnFG';

// Initialize default admin user if not exists; ensure user1 exists for testing.
async function initializeUsers() {
  const users = await db.getUsers();

  if (users.length === 0) {
    const adminHashedPassword = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
    const defaultUsers = [
      { id: 1, username: 'admin', password: adminHashedPassword, role: 'admin', name: 'Admin User' },
      { id: 2, username: 'user1', password: USER1_PASSWORD_HASH, role: 'user', name: 'Standard User' }
    ];
    await db.setUsers(defaultUsers);
    return;
  }

  let changed = false;
  const adminIndex = users.findIndex(u => u.username === 'admin');
  if (adminIndex !== -1) {
    try {
      const isOldDefault = bcrypt.compareSync('admin123', users[adminIndex].password || '');
      if (isOldDefault) {
        users[adminIndex].password = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
        changed = true;
      }
    } catch (e) { /* leave untouched */ }
  }
  if (!users.some(u => u.username === 'user1')) {
    const nextId = Math.max(...users.map(u => u.id), 0) + 1;
    users.push({ id: nextId, username: 'user1', password: USER1_PASSWORD_HASH, role: 'user', name: 'Standard User' });
    changed = true;
  }
  if (changed) await db.setUsers(users);
}

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize sample runsheet data
async function initializeRunsheets() {
  const runsheets = await db.getRunsheets();
  if (runsheets.length === 0) {
    const sampleRunsheets = [
      { id: 1, shiftDate: '06/12/2025', bookOnTime: '17:35', bookOffTime: '02:00', trust: 'SCAS', callsign: 'Pa926', shiftEnded: true },
      { id: 2, shiftDate: '05/12/2025', bookOnTime: '20:37', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA234', shiftEnded: true },
      { id: 3, shiftDate: '04/12/2025', bookOnTime: '21:00', bookOffTime: '07:45', trust: 'SCAS', callsign: 'PA201', shiftEnded: true },
      { id: 4, shiftDate: '03/12/2025', bookOnTime: '21:36', bookOffTime: '08:15', trust: 'SCAS', callsign: 'PA226', shiftEnded: true },
      { id: 5, shiftDate: '03/12/2025', bookOnTime: '21:00', bookOffTime: '21:36', trust: 'SCAS', callsign: 'PA926', shiftEnded: true },
      { id: 6, shiftDate: '02/12/2025', bookOnTime: '21:00', bookOffTime: '08:15', trust: 'SCAS', callsign: 'Pa842', shiftEnded: true },
      { id: 7, shiftDate: '01/12/2025', bookOnTime: '19:00', bookOffTime: '10:30', trust: 'EMAS', callsign: 'ELT81', shiftEnded: true },
      { id: 8, shiftDate: '30/11/2025', bookOnTime: '19:00', bookOffTime: '09:30', trust: 'EMAS', callsign: 'ELT 82', shiftEnded: true },
      { id: 9, shiftDate: '11/10/2025', bookOnTime: '18:45', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA242', shiftEnded: true },
      { id: 10, shiftDate: '10/10/2025', bookOnTime: '19:38', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA234', shiftEnded: true },
      { id: 11, shiftDate: '09/10/2025', bookOnTime: '19:47', bookOffTime: '06:00', trust: 'SCAS', callsign: 'PA848', shiftEnded: true },
      { id: 12, shiftDate: '08/10/2025', bookOnTime: '20:55', bookOffTime: '07:30', trust: 'SCAS', callsign: 'PA829', shiftEnded: true },
      { id: 13, shiftDate: '30/07/2025', bookOnTime: '20:50', bookOffTime: '08:45', trust: 'SCAS', callsign: 'PA928', shiftEnded: true },
      { id: 14, shiftDate: '29/07/2025', bookOnTime: '20:46', bookOffTime: '08:00', trust: 'SCAS', callsign: 'PA842', shiftEnded: true },
      { id: 15, shiftDate: '28/07/2025', bookOnTime: '17:58', bookOffTime: '06:45', trust: 'EMAS', callsign: 'ELT24', shiftEnded: true },
      { id: 16, shiftDate: '27/07/2025', bookOnTime: '19:47', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA927', shiftEnded: true },
      { id: 17, shiftDate: '26/07/2025', bookOnTime: '21:00', bookOffTime: '07:15', trust: 'SCAS', callsign: 'PA926', shiftEnded: true },
      { id: 18, shiftDate: '31/05/2025', bookOnTime: '21:00', bookOffTime: '07:30', trust: 'SCAS', callsign: 'PA927', shiftEnded: true },
      { id: 19, shiftDate: '30/05/2025', bookOnTime: '20:00', bookOffTime: '06:30', trust: 'SCAS', callsign: 'PA827', shiftEnded: true },
      { id: 20, shiftDate: '29/05/2025', bookOnTime: '20:00', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA907', shiftEnded: true },
      { id: 21, shiftDate: '28/05/2025', bookOnTime: '20:00', bookOffTime: '06:30', trust: 'SCAS', callsign: 'PA231', shiftEnded: true },
      { id: 22, shiftDate: '27/05/2025', bookOnTime: '15:59', bookOffTime: '02:30', trust: 'EMAS', callsign: 'PA224', shiftEnded: true },
      { id: 23, shiftDate: '26/05/2025', bookOnTime: '16:00', bookOffTime: '02:00', trust: 'SCAS', callsign: 'PA231', shiftEnded: true },
      { id: 24, shiftDate: '25/04/2025', bookOnTime: '20:58', bookOffTime: '08:15', trust: 'SCAS', callsign: 'PA843', shiftEnded: true },
      { id: 25, shiftDate: '24/04/2025', bookOnTime: '20:50', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA242', shiftEnded: true },
      { id: 26, shiftDate: '23/04/2025', bookOnTime: '19:00', bookOffTime: '08:00', trust: 'SCAS', callsign: 'PA201', shiftEnded: true },
      { id: 27, shiftDate: '22/04/2025', bookOnTime: '20:00', bookOffTime: '07:30', trust: 'SCAS', callsign: 'PA234', shiftEnded: true },
      { id: 28, shiftDate: '21/04/2025', bookOnTime: '18:00', bookOffTime: '06:00', trust: 'EMAS', callsign: 'ELT81', shiftEnded: true },
      { id: 29, shiftDate: '20/04/2025', bookOnTime: '19:00', bookOffTime: '08:00', trust: 'SCAS', callsign: 'PA926', shiftEnded: true },
      { id: 30, shiftDate: '19/04/2025', bookOnTime: '20:00', bookOffTime: '07:00', trust: 'SCAS', callsign: 'PA842', shiftEnded: true },
      { id: 31, shiftDate: '18/04/2025', bookOnTime: '21:00', bookOffTime: '08:30', trust: 'SCAS', callsign: 'PA242', shiftEnded: true },
      { id: 32, shiftDate: '17/04/2025', bookOnTime: '19:30', bookOffTime: '07:15', trust: 'SCAS', callsign: 'PA234', shiftEnded: true }
    ];
    await db.setRunsheets(sampleRunsheets);
  }
}

// Routes

// Health check endpoint for cron jobs (keeps service active) - must be before other routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AmbuCheck API'
  });
});

// Authentication
app.post('/api/login', async (req, res) => {
  const { username, password, pin } = req.body || {};
  if (!username || !password) {
    console.log('[Login] 400: missing username or password in body');
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const user = await db.findUserByUsername(username);

  if (!user) {
    console.log('[Login] 401: user not found:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log('[Login] 401: invalid password for user:', user.username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
  });
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
  const users = await db.getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    res.json({ id: user.id, username: user.username, role: user.role, name: user.name });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get runsheets with pagination and search
app.get('/api/runsheets', authenticateToken, async (req, res) => {
  const { page = 1, limit = 25, search = '' } = req.query;
  let runsheets = await db.getRunsheets();

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    runsheets = runsheets.filter(r => 
      r.callsign.toLowerCase().includes(searchLower) ||
      r.trust.toLowerCase().includes(searchLower) ||
      r.shiftDate.includes(search)
    );
  }

  // Sort by shift date (newest first)
  runsheets.sort((a, b) => {
    const dateA = new Date(a.shiftDate.split('/').reverse().join('-'));
    const dateB = new Date(b.shiftDate.split('/').reverse().join('-'));
    return dateB - dateA;
  });

  const total = runsheets.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRunsheets = runsheets.slice(startIndex, endIndex);

  res.json({
    runsheets: paginatedRunsheets,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit)
  });
});

// Get single runsheet
app.get('/api/runsheets/:id', authenticateToken, async (req, res) => {
  const runsheets = await db.getRunsheets();
  const runsheet = runsheets.find(r => r.id === parseInt(req.params.id, 10));
  if (runsheet) {
    res.json(runsheet);
  } else {
    res.status(404).json({ error: 'Runsheet not found' });
  }
});

// Admin-only: list completed generic form submissions by formId
app.get('/api/admin/forms/:formId/submissions', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { formId } = req.params;
  try {
    const submissions = await db.getFormSubmissions(formId);
    console.log('[Form] Listed submissions:', formId, 'count:', submissions.length);
    res.json(submissions);
  } catch (err) {
    console.error('[Form] Failed to list submissions:', formId, err.message);
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// Upload single photo (to disk and optionally to S3 for persistence)
app.post('/api/upload/:fieldName', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  let pathOrUrl = `/uploads/${req.file.filename}`;
  if (storage.isPersistentStorageConfigured()) {
    try {
      const buffer = fs.readFileSync(req.file.path);
      const url = await storage.uploadPersistent(buffer, req.file.originalname || req.file.filename);
      if (url) {
        pathOrUrl = url;
        console.log('[Upload] Stored in persistent storage:', url.slice(0, 60) + '...');
      }
    } catch (err) {
      console.error('[Upload] Persistent storage failed, using local path:', err.message);
    }
  }
  res.json({
    filename: req.file.filename,
    path: pathOrUrl,
    fieldName: req.params.fieldName
  });
});

// Create or update equipment check
app.post('/api/equipment-checks', authenticateToken, upload.fields([
  { name: 'frontPhoto', maxCount: 1 },
  { name: 'nearsidePhoto', maxCount: 1 },
  { name: 'rearPhoto', maxCount: 1 },
  { name: 'offsidePhoto', maxCount: 1 }
]), async (req, res) => {
  const checkData = JSON.parse(req.body.data || '{}');
  const photos = {};
  const fileKeys = ['frontPhoto', 'nearsidePhoto', 'rearPhoto', 'offsidePhoto'];
  for (const key of fileKeys) {
    const file = req.files?.[key]?.[0];
    if (!file) continue;
    let pathOrUrl = `/uploads/${file.filename}`;
    if (storage.isPersistentStorageConfigured()) {
      try {
        const buffer = fs.readFileSync(file.path);
        const url = await storage.uploadPersistent(buffer, file.originalname || file.filename);
        if (url) pathOrUrl = url;
      } catch (e) {
        console.error('[Equipment check] Persistent storage failed for', key, e.message);
      }
    }
    photos[key] = pathOrUrl;
  }
  const newCheck = await db.addEquipmentCheck({
    ...checkData,
    photos,
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  });
  res.json(newCheck);
});

// Get equipment checks
app.get('/api/equipment-checks', authenticateToken, async (req, res) => {
  const checks = await db.getEquipmentChecks();
  res.json(checks);
});

// Admin-only: generate PDF for a VDI – Start of Shift equipment check
app.get('/api/admin/equipment-checks/:id/pdf', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const id = parseInt(req.params.id, 10);
  const check = await db.getEquipmentCheckById(id);

  if (!check) {
    return res.status(404).json({ error: 'Equipment check not found' });
  }

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="vdi-start-${id}.pdf"`
  );
  doc.pipe(res);

  doc.fontSize(16).text('AmbuCheck – VDI Start of Shift', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(13).text(`Record ID: ${check.id}`);
  doc.fontSize(11).text(`Vehicle registration: ${check.registration || '-'}`);
  doc.text(`Vehicle call sign: ${check.vehicleCallsign || '-'}`);
  doc.text(`Staff name: ${check.staffName || '-'}`);
  doc.text(`Created at: ${check.createdAt || '-'}`);
  doc.moveDown();

  doc.fontSize(13).text('Checklist Values', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11);

  const {
    photos,
    id: _id,
    createdAt,
    createdBy,
    ...rest
  } = check;

  Object.entries(rest).forEach(([key, value]) => {
    const safeValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    doc.text(`${key}: ${safeValue}`, { lineGap: 2 });
  });

  if (photos && Object.keys(photos).length > 0) {
    doc.moveDown();
    doc.fontSize(13).text('Photos', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    for (const [key, pathValue] of Object.entries(photos)) {
      doc.text(`${key}:`, { continued: false });
      doc.moveDown(0.25);
      const embedded = await embedImageInPdf(doc, pathValue, 40, 512, 200);
      if (embedded) {
        doc.moveDown(0.3);
      } else {
        doc.fontSize(10).text(pathValue || '—', { lineGap: 2 });
        doc.moveDown(0.3);
      }
    }
  }

  doc.end();
});

// Generic form submissions (for Driver Checklist, etc.)
app.post('/api/forms/:formId/submissions', authenticateToken, async (req, res) => {
  const { formId } = req.params;
  const { values, formSnapshot } = req.body || {};

  if (!values || typeof values !== 'object') {
    return res.status(400).json({ error: 'Invalid form data' });
  }

  try {
    const newSubmission = await db.addFormSubmission(formId, {
      values,
      formSnapshot: formSnapshot && typeof formSnapshot === 'object' ? formSnapshot : undefined,
      createdBy: req.user.id,
    });
    console.log('[Form] Saved submission:', formId, 'id:', newSubmission.id, 'user:', req.user.id);
    res.json(newSubmission);
  } catch (err) {
    console.error('[Form] Failed to save submission:', formId, err.message);
    res.status(500).json({ error: 'Failed to save form submission. Please try again.' });
  }
});

// Helper: format a value for PDF display (avoid huge strings, handle arrays/objects)
function formatPdfValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Helper: resolve upload path to local file path; return null if not an image or file missing
const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;
function getLocalImagePath(value) {
  if (typeof value !== 'string' || !value) return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('/uploads/') && !IMAGE_EXT.test(trimmed)) return null;
  const filename = trimmed.startsWith('/uploads/') ? trimmed.slice('/uploads/'.length) : path.basename(trimmed);
  const localPath = path.join(__dirname, 'uploads', filename);
  if (!fs.existsSync(localPath)) return null;
  if (!IMAGE_EXT.test(filename)) return null;
  return localPath;
}

// Helper: get image buffer from local path or from URL (S3/public URL)
async function getImageBuffer(value) {
  if (typeof value !== 'string' || !value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const localPath = getLocalImagePath(trimmed);
  if (localPath) {
    try {
      return fs.readFileSync(localPath);
    } catch (e) {
      return null;
    }
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const res = await fetch(trimmed, { headers: { Accept: 'image/*' } });
      if (!res.ok) return null;
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Helper: ensure at least requiredHeight points fit on current page; if not, add a new page.
// Uses page.maxY() and a buffer so images are never clipped at the page edge.
function ensureSpaceForImage(doc, requiredHeight, margin) {
  const pageBottom = typeof doc.page.maxY === 'function' ? doc.page.maxY() : (doc.page.height - (doc.page.margins?.bottom ?? margin));
  const bufferPt = 15; // extra gap so image never touches page break
  if (doc.y + requiredHeight > pageBottom - bufferPt) {
    doc.addPage();
  }
}

// Helper: embed image in PDF doc if path/URL resolves, else return false (async).
// Always starts the image on a new page so it is never cut off (full image visible).
async function embedImageInPdf(doc, value, margin, contentWidth, maxImageHeight = 220) {
  const buffer = await getImageBuffer(value);
  if (!buffer) return false;
  try {
    doc.addPage(); // each image on its own page so it is never clipped
    doc.image(buffer, margin, doc.y, { fit: [contentWidth, maxImageHeight], align: 'center' });
    doc.y += maxImageHeight;
    doc.moveDown(0.4);
    return true;
  } catch (err) {
    return false;
  }
}

// Styled form PDF: page layout constants
const PDF_MARGIN = 50;
const PDF_CONTENT_WIDTH = 512; // letter width 612 - 2*margin
const PDF_FIELD_BOX_HEIGHT = 22;
const PDF_FIELD_PADDING = 5;

// Admin-only: generate PDF for a generic form submission (styled form layout when formSnapshot exists)
app.get('/api/admin/forms/:formId/submissions/:submissionId/pdf', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { formId, submissionId } = req.params;
  const submission = await db.getFormSubmissionById(formId, submissionId);

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const doc = new PDFDocument({ margin: PDF_MARGIN });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${formId}-submission-${submissionId}.pdf"`
  );
  doc.pipe(res);

  const values = submission.values || {};
  const snapshot = submission.formSnapshot;

  if (snapshot && snapshot.title && Array.isArray(snapshot.sections) && snapshot.sections.length > 0) {
    // Styled form: bold title, section headings, label + value-in-box per field
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#000').text(snapshot.title, { align: 'left' });
    doc.moveDown(0.4);
    doc.font('Helvetica').fontSize(9).fillColor('#666').text(`Submission ID: ${submission.id}  ·  Submitted: ${submission.createdAt || '-'}  ·  User ID: ${submission.createdBy ?? '-'}`);
    doc.fillColor('#000').moveDown(1.2);

    for (const section of snapshot.sections) {
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#000').text(section.title || 'Section', { align: 'left' });
      doc.moveDown(0.6);
      doc.font('Helvetica').fontSize(10);

      const fields = section.fields || [];
      for (const field of fields) {
        const label = field.label || field.id || '';
        const value = values[field.id];
        const displayValue = formatPdfValue(value) || '—';
        const isLikelyImage = typeof displayValue === 'string' && (displayValue.startsWith('http') || displayValue.startsWith('/'));

        if (isLikelyImage) {
          doc.fillColor('#000').font('Helvetica-Bold').fontSize(11).text(label, PDF_MARGIN, doc.y, { continued: false });
        } else {
          doc.fillColor('#000').font('Helvetica').fontSize(10).text(label, PDF_MARGIN, doc.y, { continued: false });
        }
        doc.moveDown(0.25);

        const embedded = await embedImageInPdf(doc, displayValue, PDF_MARGIN, PDF_CONTENT_WIDTH);
        if (embedded) {
          doc.moveDown(0.3);
          continue;
        }

        const boxTop = doc.y;
        const textHeight = Math.max(PDF_FIELD_BOX_HEIGHT - PDF_FIELD_PADDING * 2, doc.heightOfString(displayValue, { width: PDF_CONTENT_WIDTH - PDF_FIELD_PADDING * 2 }));
        const boxHeight = textHeight + PDF_FIELD_PADDING * 2;

        doc.rect(PDF_MARGIN, boxTop, PDF_CONTENT_WIDTH, boxHeight).fillAndStroke('#f5f5f5', '#e0e0e0');

        doc.fillColor('#000').font('Helvetica').fontSize(10).text(displayValue, PDF_MARGIN + PDF_FIELD_PADDING, boxTop + PDF_FIELD_PADDING, {
          width: PDF_CONTENT_WIDTH - PDF_FIELD_PADDING * 2,
          align: 'left',
        });

        doc.y = boxTop + boxHeight;
        doc.moveDown(0.5);
      }

      doc.moveDown(0.6);
    }
  } else {
    // Fallback for submissions without formSnapshot (legacy): raw key-value list
    doc.font('Helvetica-Bold').fontSize(16).text('AmbuCheck – Completed Form', { align: 'left' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11).text(`Form: ${formId}`);
    doc.text(`Submission ID: ${submission.id}`);
    doc.text(`Submitted at: ${submission.createdAt || '-'}`);
    doc.text(`Submitted by (user id): ${submission.createdBy || '-'}`);
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(12).text('Answers', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10);
    Object.entries(values).forEach(([key, value]) => {
      doc.text(`${key}: ${formatPdfValue(value)}`, { lineGap: 2 });
    });
  }

  doc.end();
});

// Form configuration overrides (admin-editable)
// All authenticated users can read effective config via /api/forms/config/:formId
// Admins can create/update overrides via /api/admin/forms/config/:formId

app.get('/api/forms/config/:formId', authenticateToken, async (req, res) => {
  const { formId } = req.params;
  const allConfigs = await db.getFormConfigOverrides();
  const override = allConfigs[formId];

  if (!override) {
    return res.status(404).json({ error: 'No override found' });
  }

  res.json({ formId, config: override });
});

app.get('/api/admin/forms/config/:formId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { formId } = req.params;
  const allConfigs = await db.getFormConfigOverrides();
  const override = allConfigs[formId];

  if (!override) {
    return res.status(404).json({ error: 'No override found' });
  }

  res.json({ formId, config: override });
});

app.put('/api/admin/forms/config/:formId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { formId } = req.params;
  const { config } = req.body || {};

  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'Valid form config object is required' });
  }

  await db.setFormConfigOverride(formId, config);
  res.json({ formId, config });
});

// Admin routes
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const users = await db.getUsers();
  res.json(users.map(u => ({ ...u, password: undefined })));
});

// Admin: Practitioner management
app.get('/api/admin/practitioners', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const practitioners = await db.getPractitioners();
  res.json(practitioners);
});

app.post('/api/admin/practitioners', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { name, pin, role = 'crew', active = true } = req.body || {};
  if (!name || !pin) {
    return res.status(400).json({ error: 'Name and PIN are required' });
  }
  const newPractitioner = await db.addPractitioner({ name, pin, role, active });
  res.status(201).json(newPractitioner);
});

app.put('/api/admin/practitioners/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const id = parseInt(req.params.id, 10);
  const updated = await db.updatePractitioner(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Practitioner not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/practitioners/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const id = parseInt(req.params.id, 10);
  const deleted = await db.deletePractitioner(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Practitioner not found' });
  }
  res.status(204).end();
});

// Vehicles (registrations / call signs)
app.get('/api/vehicles', authenticateToken, async (req, res) => {
  const vehicles = await db.getVehicles();
  res.json(vehicles);
});

app.get('/api/admin/vehicles', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const vehicles = await db.getVehicles();
  res.json(vehicles);
});

app.post('/api/admin/vehicles', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { registration, callsign = '', description = '' } = req.body || {};
  if (!registration) {
    return res.status(400).json({ error: 'Registration is required' });
  }
  const newVehicle = await db.addVehicle({ registration, callsign, description });
  res.status(201).json(newVehicle);
});

app.put('/api/admin/vehicles/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateVehicle(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/vehicles/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const id = parseInt(req.params.id, 10);
  const deleted = await db.deleteVehicle(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.status(204).end();
});

// Serve React client build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');

  if (fs.existsSync(clientBuildPath)) {
    // Serve static files (but not for API routes)
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      express.static(clientBuildPath)(req, res, next);
    });

    // All non-API routes should serve the React index.html
    app.get('*', (req, res) => {
      // Don't serve React app for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
}

async function start() {
  await db.init();
  if (db.useDb) {
    console.log('Using PostgreSQL (DATABASE_URL set)');
  } else {
    console.log('Using JSON file storage (DATABASE_URL not set)');
  }
  if (storage.isSupabaseConfigured()) {
    console.log('Upload storage: Supabase (SUPABASE_URL set)');
  } else if (storage.isS3Configured()) {
    console.log('Upload storage: S3/R2');
  } else {
    console.log('Upload storage: local disk only (images may not persist across deploys)');
  }
  await initializeUsers();
  await initializeRunsheets();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
