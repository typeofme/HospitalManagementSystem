const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Web routes (require admin access)
router.get('/', requireAdmin, UserController.showUsersPage);

module.exports = router;
