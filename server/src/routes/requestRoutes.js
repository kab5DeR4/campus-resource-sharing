const express = require('express');
const {
  getIncomingRequests,
  getMyRequests,
  respondToRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getMyRequests);
router.get('/incoming', requireAuth, getIncomingRequests);
router.patch('/:id/respond', requireAuth, respondToRequest);
router.patch('/:id/cancel', requireAuth, cancelRequest);

// generic patch route if client sends action in body
router.patch('/:id', requireAuth, (req, res, next) => {
  if (req.body.action === 'cancel') {
    return cancelRequest(req, res, next);
  }
  return respondToRequest(req, res, next);
});

module.exports = router;
