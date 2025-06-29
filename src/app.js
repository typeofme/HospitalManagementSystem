require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http:", "https:", "data:", "blob:"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "http:", 
        "https:", 
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "http:", 
        "https:", 
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'", 
        "http:", 
        "https:", 
        "https://cdnjs.cloudflare.com",
        "https://fonts.gstatic.com"
      ],
      imgSrc: ["'self'", "data:", "http:", "https:"],
      connectSrc: ["'self'", "http:", "https:"],
      upgradeInsecureRequests: null // 👈 This disables auto HTTPS upgrade
    }
  }
}));

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine and layout
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layout');

// Middleware to pass user data to all views
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

// Routes
const { requireAuth, optionalAuth } = require('./middleware/auth');

// Authentication routes (public)
app.use('/', require('./routes/auth'));

// Protected API routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/treatments', require('./routes/treatments'));

// User management API routes
app.use('/api/users', require('./routes/userApi'));

// User management web routes
app.use('/users', require('./routes/users'));

// Protected web routes
app.use('/', requireAuth, require('./routes/web'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🏥 Hospital Management System running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});
