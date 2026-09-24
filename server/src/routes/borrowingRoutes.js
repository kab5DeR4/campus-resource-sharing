const express = require('express');
const { getBorrowings, confirmReturn } = require('../controllers/borrowingController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getBorrowings);
router.patch('/:id/return', requireAuth, confirmReturn);

module.exports = router;
