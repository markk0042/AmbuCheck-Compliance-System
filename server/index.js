const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper functions for data persistence
const getDataFile = (filename) => path.join(dataDir, filename);

const readJSON = (filename) => {
  const filePath = getDataFile(filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJSON = (filename, data) => {
  const filePath = getDataFile(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Initialize default admin user if not exists
const initializeUsers = () => {
  let users = readJSON('users.json');

  // First-time initialisation: create default users file.
  if (users.length === 0) {
    const adminHashedPassword = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
    const defaultUsers = [
      {
        id: 1,
        username: 'admin',
        password: adminHashedPassword,
        role: 'admin',
        name: 'Admin User'
      },
      {
        id: 2,
        username: 'markkelly',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        name: 'Mark Kelly'
      }
    ];
    writeJSON('users.json', defaultUsers);
    return;
  }

  // One-time migration: if existing admin user is still using the old default password,
  // update it to the new default ADMIN_DEFAULT_PASSWORD.
  const adminIndex = users.findIndex(u => u.username === 'admin');
  if (adminIndex !== -1) {
    try {
      const isOldDefault = bcrypt.compareSync('admin123', users[adminIndex].password || '');
      if (isOldDefault) {
        users[adminIndex].password = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
        writeJSON('users.json', users);
      }
    } catch (e) {
      // If comparison fails for any reason, leave users untouched.
    }
  }
};
initializeUsers();

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
const initializeRunsheets = () => {
  const runsheets = readJSON('runsheets.json');
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
    writeJSON('runsheets.json', sampleRunsheets);
  }
};
initializeRunsheets();

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
  const { username, password, pin } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // For users, require PIN
  if (user.role === 'user' && !pin) {
    return res.status(401).json({ error: 'PIN required for user login' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
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
app.get('/api/me', authenticateToken, (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get runsheets with pagination and search
app.get('/api/runsheets', authenticateToken, (req, res) => {
  const { page = 1, limit = 25, search = '' } = req.query;
  let runsheets = readJSON('runsheets.json');

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
app.get('/api/runsheets/:id', authenticateToken, (req, res) => {
  const runsheets = readJSON('runsheets.json');
  const runsheet = runsheets.find(r => r.id === parseInt(req.params.id));
  if (runsheet) {
    res.json(runsheet);
  } else {
    res.status(404).json({ error: 'Runsheet not found' });
  }
});

// Upload single photo
app.post('/api/upload/:fieldName', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    fieldName: req.params.fieldName
  });
});

// Create or update equipment check
app.post('/api/equipment-checks', authenticateToken, upload.fields([
  { name: 'frontPhoto', maxCount: 1 },
  { name: 'nearsidePhoto', maxCount: 1 },
  { name: 'rearPhoto', maxCount: 1 },
  { name: 'offsidePhoto', maxCount: 1 }
]), (req, res) => {
  const equipmentChecks = readJSON('equipment-checks.json');
  const checkData = JSON.parse(req.body.data || '{}');
  
  // Handle file uploads
  const photos = {};
  if (req.files) {
    if (req.files.frontPhoto) photos.frontPhoto = `/uploads/${req.files.frontPhoto[0].filename}`;
    if (req.files.nearsidePhoto) photos.nearsidePhoto = `/uploads/${req.files.nearsidePhoto[0].filename}`;
    if (req.files.rearPhoto) photos.rearPhoto = `/uploads/${req.files.rearPhoto[0].filename}`;
    if (req.files.offsidePhoto) photos.offsidePhoto = `/uploads/${req.files.offsidePhoto[0].filename}`;
  }

  const newCheck = {
    id: equipmentChecks.length > 0 ? Math.max(...equipmentChecks.map(c => c.id)) + 1 : 1,
    ...checkData,
    photos,
    createdAt: new Date().toISOString(),
    createdBy: req.user.id
  };

  equipmentChecks.push(newCheck);
  writeJSON('equipment-checks.json', equipmentChecks);

  res.json(newCheck);
});

// Get equipment checks
app.get('/api/equipment-checks', authenticateToken, (req, res) => {
  const checks = readJSON('equipment-checks.json');
  res.json(checks);
});

// Generic form submissions (for Driver Checklist, etc.)
app.post('/api/forms/:formId/submissions', authenticateToken, (req, res) => {
  const { formId } = req.params;
  const { values } = req.body || {};

  if (!values || typeof values !== 'object') {
    return res.status(400).json({ error: 'Invalid form data' });
  }

  const filename = `form-${formId}-submissions.json`;
  const submissions = readJSON(filename);

  const newSubmission = {
    id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
    formId,
    values,
    createdAt: new Date().toISOString(),
    createdBy: req.user.id,
  };

  submissions.push(newSubmission);
  writeJSON(filename, submissions);

  res.json(newSubmission);
});

// Admin routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const users = readJSON('users.json');
  res.json(users.map(u => ({ ...u, password: undefined })));
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
