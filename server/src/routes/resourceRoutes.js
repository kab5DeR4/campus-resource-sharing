const express = require('express');
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { createRequest } = require('../controllers/requestController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getResources);
router.get('/:id', optionalAuth, getResourceById);
router.post('/', requireAuth, createResource);
router.patch('/:id', requireAuth, updateResource);
router.delete('/:id', requireAuth, deleteResource);

// submit borrowing request directly on resource endpoint
router.post('/:id/request', requireAuth, createRequest);

module.exports = router;
