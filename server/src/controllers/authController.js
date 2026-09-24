const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { signToken } = require('../utils/jwt');
const { sanitizeUser, isValidEmail } = require('../utils/helpers');

// cookie config for auth session
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// handle new student signup
function register(req, res) {
  const { name, email, password, campus, course, bio } = req.body;

  // input validation checks
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name (at least 2 chars)' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!campus || typeof campus !== 'string' || campus.trim().length < 2) {
    return res.status(400).json({ error: 'Please select or enter your campus' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // check if user already exists
  const existingUser = db.get('SELECT id FROM users WHERE email = ?', [cleanEmail]);
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  // hash password
  const passwordHash = bcrypt.hashSync(password, 10);
  const avatarSeed = name.trim().toLowerCase().replace(/\s+/g, '-');

  const result = db.run(
    `INSERT INTO users (name, email, password_hash, campus, course, bio, avatar_seed)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name.trim(), cleanEmail, passwordHash, campus.trim(), course ? course.trim() : null, bio ? bio.trim() : null, avatarSeed]
  );

  const newUser = db.get('SELECT * FROM users WHERE id = ?', [result.lastInsertRowid]);
  const safeUser = sanitizeUser(newUser);

  // create token and set cookie
  const token = signToken({ userId: safeUser.id, email: safeUser.email, name: safeUser.name });
  res.cookie('token', token, COOKIE_OPTIONS);

  return res.status(201).json({
    message: 'Registration successful! Welcome to campus sharing.',
    user: safeUser,
    token, // returned for clients using token header
  });
}

// log in an existing student
function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const safeUser = sanitizeUser(user);
  const token = signToken({ userId: safeUser.id, email: safeUser.email, name: safeUser.name });
  res.cookie('token', token, COOKIE_OPTIONS);

  return res.json({
    message: `Welcome back, ${safeUser.name}!`,
    user: safeUser,
    token,
  });
}

// sign out student and clear cookie
function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully' });
}

// get current authenticated student profile
function getMe(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
