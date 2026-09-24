const { verifyToken } = require('../utils/jwt');
const db = require('../db/database');
const { sanitizeUser } = require('../utils/helpers');

// required auth guard - bounce if not logged in
function requireAuth(req, res, next) {
  // check cookie or authorization header fr
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Session expired or invalid, please log in again' });
  }

  // grab user from db to make sure they still exist
  const user = db.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
  if (!user) {
    return res.status(401).json({ error: 'User account not found' });
  }

  req.user = sanitizeUser(user);
  next();
}

// optional auth middleware - if token exists, attach user, else continue chill
function optionalAuth(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded && decoded.userId) {
    const user = db.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    req.user = user ? sanitizeUser(user) : null;
  } else {
    req.user = null;
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
