const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated (for web routes)
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  
  res.redirect('/login');
};

// Middleware to check if user is admin (for web routes)
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    req.user = req.session.user;
    return next();
  }
  
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  
  res.status(403).render('error', { 
    error: 'Access denied. Admin privileges required.'
  });
};

// Middleware to check if user can manage staff (admin or staff roles)
const requireStaffManagement = (req, res, next) => {
  if (req.session && req.session.user && 
      (req.session.user.role === 'admin' || req.session.user.role === 'staff')) {
    req.user = req.session.user;
    return next();
  }
  
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  
  res.status(403).render('error', { 
    error: 'Access denied. Administrative privileges required.'
  });
};

// Middleware to check if user can view medical data (all roles except guest)
const requireMedicalAccess = (req, res, next) => {
  if (req.session && req.session.user && 
      ['admin', 'doctor', 'nurse', 'staff'].includes(req.session.user.role)) {
    req.user = req.session.user;
    return next();
  }
  
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  
  res.status(403).render('error', { 
    error: 'Access denied. Medical staff privileges required.'
  });
};

// Middleware to check JWT token (for API routes)
const requireApiAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token or user inactive.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if API user is admin
const requireApiAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_active || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if API user can manage staff (admin or staff)
const requireApiStaffManagement = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_active || !['admin', 'staff'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if API user has medical access
const requireApiMedicalAccess = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_active || !['admin', 'doctor', 'nurse', 'staff'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Medical staff privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to pass user info to views (optional auth)
const optionalAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireStaffManagement,
  requireMedicalAccess,
  requireApiAuth,
  requireApiAdmin,
  requireApiStaffManagement,
  requireApiMedicalAccess,
  optionalAuth
};
