const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { requireApiAuth, requireApiAdmin } = require('../middleware/auth');

// API routes for user management
router.get('/', requireApiAdmin, UserController.index);
router.get('/:id', requireApiAdmin, UserController.show);
router.post('/', requireApiAdmin, UserController.store);
router.put('/:id', requireApiAdmin, UserController.update);
router.delete('/:id', requireApiAdmin, UserController.destroy);

module.exports = router;
