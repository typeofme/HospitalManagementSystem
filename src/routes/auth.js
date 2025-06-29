const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Web routes
router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);

// API routes
router.post('/api/auth/login', AuthController.apiLogin);

module.exports = router;
