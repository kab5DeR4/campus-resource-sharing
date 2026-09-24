const db = require('../db/database');
const { VALID_CATEGORIES, VALID_CONDITIONS } = require('../utils/helpers');

// fetch resources with search, filter, and sorting
function getResources(req, res) {
  const { search, category, condition, campus, status, sort } = req.query;

  let sql = `
    SELECT 
      r.id, r.owner_id, r.title, r.description, r.category, r.condition,
      r.campus, r.status, r.image_url, r.created_at, r.updated_at,
      u.name AS owner_name, u.campus AS owner_campus, u.course AS owner_course
    FROM resources r
    JOIN users u ON r.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];

  // text search across title and description
  if (search && search.trim()) {
    sql += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
    const searchWildcard = `%${search.trim()}%`;
    params.push(searchWildcard, searchWildcard);
  }

  // category filter
  if (category && category !== 'All' && category.trim()) {
    sql += ` AND r.category = ?`;
    params.push(category.trim());
  }

  // condition filter
  if (condition && condition !== 'All' && condition.trim()) {
    sql += ` AND r.condition = ?`;
    params.push(condition.trim());
  }

  // campus filter
  if (campus && campus !== 'All' && campus.trim()) {
    sql += ` AND r.campus = ?`;
    params.push(campus.trim());
  }

  // status filter (e.g. AVAILABLE, REQUESTED, UNAVAILABLE)
  if (status && status !== 'All' && status.trim()) {
    sql += ` AND r.status = ?`;
    params.push(status.trim().toUpperCase());
  }

  // sorting logic - default puts AVAILABLE first, then recent
  if (sort === 'oldest') {
    sql += ` ORDER BY r.created_at ASC`;
  } else if (sort === 'title') {
    sql += ` ORDER BY r.title ASC`;
  } else {
    // default: available items on top, then newest
    sql += ` ORDER BY CASE WHEN r.status = 'AVAILABLE' THEN 0 WHEN r.status = 'REQUESTED' THEN 1 ELSE 2 END, r.created_at DESC`;
  }

  const items = db.all(sql, params);
  return res.json({ resources: items, count: items.length });
}

// get single resource with rich details and borrower context
function getResourceById(req, res) {
  const resourceId = Number(req.params.id);
  if (!resourceId) {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  const resource = db.get(
    `SELECT 
       r.id, r.owner_id, r.title, r.description, r.category, r.condition,
       r.campus, r.status, r.image_url, r.created_at, r.updated_at,
       u.name AS owner_name, u.email AS owner_email, u.campus AS owner_campus, 
       u.course AS owner_course, u.avatar_seed AS owner_avatar_seed, u.created_at AS owner_joined_at
     FROM resources r
     JOIN users u ON r.owner_id = u.id
     WHERE r.id = ?`,
    [resourceId]
  );

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // check relationship with current user if logged in
  let isOwner = false;
  let hasPendingRequest = false;
  let userActiveRequest = null;
  let userActiveBorrowing = null;

  if (req.user) {
    isOwner = req.user.id === resource.owner_id;

    // check if this user has any active pending request
    const pendingReq = db.get(
      `SELECT * FROM requests WHERE resource_id = ? AND borrower_id = ? AND status = 'PENDING'`,
      [resourceId, req.user.id]
    );
    if (pendingReq) {
      hasPendingRequest = true;
      userActiveRequest = pendingReq;
    }

    // check if this user is currently borrowing this item
    const activeBorrow = db.get(
      `SELECT * FROM borrowings WHERE resource_id = ? AND borrower_id = ? AND status = 'ACTIVE'`,
      [resourceId, req.user.id]
    );
    if (activeBorrow) {
      userActiveBorrowing = activeBorrow;
    }
  }

  return res.json({
    resource,
    isOwner,
    hasPendingRequest,
    userActiveRequest,
    userActiveBorrowing,
  });
}

// create a brand new listing
function createResource(req, res) {
  const { title, description, category, condition, campus, image_url } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title is required (at least 3 characters)' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({ error: 'Description must be at least 10 characters long' });
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  }

  if (!condition || !VALID_CONDITIONS.includes(condition)) {
    return res.status(400).json({ error: `Condition must be one of: ${VALID_CONDITIONS.join(', ')}` });
  }

  const resourceCampus = campus && campus.trim() ? campus.trim() : req.user.campus;

  const result = db.run(
    `INSERT INTO resources (owner_id, title, description, category, condition, campus, status, image_url)
     VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE', ?)`,
    [req.user.id, title.trim(), description.trim(), category, condition, resourceCampus, image_url ? image_url.trim() : null]
  );

  const createdItem = db.get('SELECT * FROM resources WHERE id = ?', [result.lastInsertRowid]);

  return res.status(201).json({
    message: 'Resource listed successfully on campus!',
    resource: createdItem,
  });
}

// edit an existing listing (owner only)
function updateResource(req, res) {
  const resourceId = Number(req.params.id);
  const resource = db.get('SELECT * FROM resources WHERE id = ?', [resourceId]);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // bounce if caller is not the owner
  if (resource.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to edit this listing' });
  }

  const { title, description, category, condition, campus, image_url } = req.body;

  if (title && (typeof title !== 'string' || title.trim().length < 3)) {
    return res.status(400).json({ error: 'Title must be at least 3 characters long' });
  }

  if (description && (typeof description !== 'string' || description.trim().length < 10)) {
    return res.status(400).json({ error: 'Description must be at least 10 characters long' });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Invalid category selected` });
  }

  if (condition && !VALID_CONDITIONS.includes(condition)) {
    return res.status(400).json({ error: `Invalid condition selected` });
  }

  const newTitle = title !== undefined ? title.trim() : resource.title;
  const newDesc = description !== undefined ? description.trim() : resource.description;
  const newCat = category !== undefined ? category : resource.category;
  const newCond = condition !== undefined ? condition : resource.condition;
  const newCampus = campus !== undefined ? campus.trim() : resource.campus;
  const newImg = image_url !== undefined ? (image_url ? image_url.trim() : null) : resource.image_url;

  db.run(
    `UPDATE resources 
     SET title = ?, description = ?, category = ?, condition = ?, campus = ?, image_url = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [newTitle, newDesc, newCat, newCond, newCampus, newImg, resourceId]
  );

  const updatedItem = db.get('SELECT * FROM resources WHERE id = ?', [resourceId]);
  return res.json({
    message: 'Resource listing updated successfully',
    resource: updatedItem,
  });
}

// delete a listing (owner only, not allowed if active borrow or pending request)
function deleteResource(req, res) {
  const resourceId = Number(req.params.id);
  const resource = db.get('SELECT * FROM resources WHERE id = ?', [resourceId]);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (resource.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this listing' });
  }

  if (resource.status === 'UNAVAILABLE') {
    return res.status(400).json({ error: 'Cannot delete an item that is currently borrowed' });
  }

  if (resource.status === 'REQUESTED') {
    return res.status(400).json({ error: 'Cannot delete an item with a pending borrowing request. Please reject or resolve it first.' });
  }

  db.run('DELETE FROM resources WHERE id = ?', [resourceId]);

  return res.json({ message: 'Resource listing deleted successfully' });
}

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
