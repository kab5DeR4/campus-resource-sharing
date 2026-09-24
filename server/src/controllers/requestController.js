const db = require('../db/database');

// submit a borrowing request for an available resource
function createRequest(req, res) {
  const resourceId = Number(req.params.id);
  const { message, expected_days } = req.body;

  if (!resourceId) {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  const resource = db.get('SELECT * FROM resources WHERE id = ?', [resourceId]);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // prevent self-borrowing
  if (resource.owner_id === req.user.id) {
    return res.status(400).json({ error: 'You cannot request to borrow your own resource' });
  }

  // check availability state
  if (resource.status !== 'AVAILABLE') {
    if (resource.status === 'REQUESTED') {
      return res.status(400).json({ error: 'This item already has a pending request from another student' });
    }
    return res.status(400).json({ error: 'This item is currently unavailable or actively borrowed' });
  }

  // check if user already has an active pending request
  const existingReq = db.get(
    `SELECT id FROM requests WHERE resource_id = ? AND borrower_id = ? AND status = 'PENDING'`,
    [resourceId, req.user.id]
  );
  if (existingReq) {
    return res.status(400).json({ error: 'You already have a pending request for this item' });
  }

  const days = Math.max(1, Math.min(60, Number(expected_days) || 7));
  const cleanMessage = message && typeof message === 'string' ? message.trim() : null;

  // atomic state transition: request inserted and resource status marked REQUESTED
  const newRequest = db.withTransaction(() => {
    const insertResult = db.run(
      `INSERT INTO requests (resource_id, borrower_id, message, expected_days, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [resourceId, req.user.id, cleanMessage, days]
    );

    db.run(
      `UPDATE resources 
       SET status = 'REQUESTED', updated_at = datetime('now')
       WHERE id = ?`,
      [resourceId]
    );

    return db.get('SELECT * FROM requests WHERE id = ?', [insertResult.lastInsertRowid]);
  });

  return res.status(201).json({
    message: 'Borrowing request sent to owner!',
    request: newRequest,
  });
}

// get incoming requests for items owned by current student
function getIncomingRequests(req, res) {
  const sql = `
    SELECT 
      req.id, req.resource_id, req.borrower_id, req.message, req.expected_days,
      req.status, req.created_at, req.updated_at,
      r.title AS resource_title, r.category AS resource_category, 
      r.condition AS resource_condition, r.image_url AS resource_image_url,
      u.name AS borrower_name, u.email AS borrower_email, 
      u.campus AS borrower_campus, u.course AS borrower_course, u.avatar_seed AS borrower_avatar_seed
    FROM requests req
    JOIN resources r ON req.resource_id = r.id
    JOIN users u ON req.borrower_id = u.id
    WHERE r.owner_id = ?
    ORDER BY CASE WHEN req.status = 'PENDING' THEN 0 ELSE 1 END, req.created_at DESC
  `;

  const incoming = db.all(sql, [req.user.id]);
  return res.json({ requests: incoming });
}

// get requests submitted by the current student
function getMyRequests(req, res) {
  const sql = `
    SELECT 
      req.id, req.resource_id, req.borrower_id, req.message, req.expected_days,
      req.status, req.created_at, req.updated_at,
      r.title AS resource_title, r.category AS resource_category, 
      r.condition AS resource_condition, r.image_url AS resource_image_url,
      r.owner_id,
      u.name AS owner_name, u.email AS owner_email, u.campus AS owner_campus
    FROM requests req
    JOIN resources r ON req.resource_id = r.id
    JOIN users u ON r.owner_id = u.id
    WHERE req.borrower_id = ?
    ORDER BY req.created_at DESC
  `;

  const myRequests = db.all(sql, [req.user.id]);
  return res.json({ requests: myRequests });
}

// owner responds: approve or reject
function respondToRequest(req, res) {
  const requestId = Number(req.params.id);
  const { action } = req.body; // 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: "Action must be either 'approve' or 'reject'" });
  }

  const request = db.get('SELECT * FROM requests WHERE id = ?', [requestId]);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.status !== 'PENDING') {
    return res.status(400).json({ error: `Cannot respond to a request that is already ${request.status.toLowerCase()}` });
  }

  const resource = db.get('SELECT * FROM resources WHERE id = ?', [request.resource_id]);
  if (!resource) {
    return res.status(404).json({ error: 'Associated resource not found' });
  }

  // verify owner permissions
  if (resource.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only the resource owner can approve or reject this request' });
  }

  if (action === 'reject') {
    db.withTransaction(() => {
      db.run(`UPDATE requests SET status = 'REJECTED', updated_at = datetime('now') WHERE id = ?`, [requestId]);
      // set resource back to AVAILABLE
      db.run(`UPDATE resources SET status = 'AVAILABLE', updated_at = datetime('now') WHERE id = ?`, [resource.id]);
    });

    return res.json({
      message: 'Request has been rejected and the resource is now available again.',
      status: 'REJECTED',
    });
  }

  // Approve action: atomic transition
  const result = db.withTransaction(() => {
    // 1. Mark request as APPROVED
    db.run(`UPDATE requests SET status = 'APPROVED', updated_at = datetime('now') WHERE id = ?`, [requestId]);

    // 2. Mark resource as UNAVAILABLE
    db.run(`UPDATE resources SET status = 'UNAVAILABLE', updated_at = datetime('now') WHERE id = ?`, [resource.id]);

    // 3. Create active borrowing record
    const days = request.expected_days || 7;
    const borrowResult = db.run(
      `INSERT INTO borrowings (resource_id, owner_id, borrower_id, request_id, borrowed_at, expected_return_at, status)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now', ?), 'ACTIVE')`,
      [resource.id, req.user.id, request.borrower_id, requestId, `+${days} days`]
    );

    // 4. Cancel any other pending requests on this resource if they existed
    db.run(
      `UPDATE requests 
       SET status = 'CANCELLED', updated_at = datetime('now') 
       WHERE resource_id = ? AND id != ? AND status = 'PENDING'`,
      [resource.id, requestId]
    );

    const borrowing = db.get('SELECT * FROM borrowings WHERE id = ?', [borrowResult.lastInsertRowid]);
    return borrowing;
  });

  return res.json({
    message: 'Request approved! Borrowing is now active.',
    borrowing: result,
  });
}

// borrower cancels their own pending request
function cancelRequest(req, res) {
  const requestId = Number(req.params.id);

  const request = db.get('SELECT * FROM requests WHERE id = ?', [requestId]);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.borrower_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only cancel your own request' });
  }

  if (request.status !== 'PENDING') {
    return res.status(400).json({ error: `Cannot cancel a request that is already ${request.status.toLowerCase()}` });
  }

  db.withTransaction(() => {
    db.run(`UPDATE requests SET status = 'CANCELLED', updated_at = datetime('now') WHERE id = ?`, [requestId]);

    // flip resource back to AVAILABLE if no other pending requests
    const otherPending = db.get(
      `SELECT id FROM requests WHERE resource_id = ? AND status = 'PENDING'`,
      [request.resource_id]
    );
    if (!otherPending) {
      db.run(`UPDATE resources SET status = 'AVAILABLE', updated_at = datetime('now') WHERE id = ?`, [request.resource_id]);
    }
  });

  return res.json({ message: 'Request cancelled successfully' });
}

module.exports = {
  createRequest,
  getIncomingRequests,
  getMyRequests,
  respondToRequest,
  cancelRequest,
};
