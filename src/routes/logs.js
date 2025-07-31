const express = require('express');
const router = express.Router();
const LogController = require('../controllers/LogController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, LogController.index);
router.get('/:id', requireAuth, LogController.show);

module.exports = router;
