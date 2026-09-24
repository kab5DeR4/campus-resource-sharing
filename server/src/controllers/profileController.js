const db = require('../db/database');
const { sanitizeUser } = require('../utils/helpers');

// get student profile with activity stats
function getProfile(req, res) {
  const userId = req.params.id ? Number(req.params.id) : req.user.id;

  const user = db.get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  // stats
  const listingsCount = db.get('SELECT COUNT(*) AS count FROM resources WHERE owner_id = ?', [userId]).count;
  const successfulBorrows = db.get(
    `SELECT COUNT(*) AS count FROM borrowings WHERE borrower_id = ? AND status = 'RETURNED'`,
    [userId]
  ).count;
  const successfulLends = db.get(
    `SELECT COUNT(*) AS count FROM borrowings WHERE owner_id = ? AND status = 'RETURNED'`,
    [userId]
  ).count;
  const activeBorrows = db.get(
    `SELECT COUNT(*) AS count FROM borrowings WHERE borrower_id = ? AND status = 'ACTIVE'`,
    [userId]
  ).count;

  // recent public listings
  const publicListings = db.all(
    `SELECT id, title, category, condition, campus, status, image_url, created_at
     FROM resources
     WHERE owner_id = ?
     ORDER BY created_at DESC
     LIMIT 6`,
    [userId]
  );

  return res.json({
    user: sanitizeUser(user),
    stats: {
      listingsCount,
      successfulBorrows,
      successfulLends,
      activeBorrows,
    },
    publicListings,
  });
}

// update current student profile details
function updateProfile(req, res) {
  const { name, campus, course, bio } = req.body;

  if (name && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  if (campus && (typeof campus !== 'string' || campus.trim().length < 2)) {
    return res.status(400).json({ error: 'Campus must be at least 2 characters' });
  }

  const currentUser = db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const newName = name !== undefined ? name.trim() : currentUser.name;
  const newCampus = campus !== undefined ? campus.trim() : currentUser.campus;
  const newCourse = course !== undefined ? (course ? course.trim() : null) : currentUser.course;
  const newBio = bio !== undefined ? (bio ? bio.trim() : null) : currentUser.bio;

  db.run(
    `UPDATE users 
     SET name = ?, campus = ?, course = ?, bio = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [newName, newCampus, newCourse, newBio, req.user.id]
  );

  const updatedUser = db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

  return res.json({
    message: 'Profile updated successfully',
    user: sanitizeUser(updatedUser),
  });
}

module.exports = {
  getProfile,
  updateProfile,
};
