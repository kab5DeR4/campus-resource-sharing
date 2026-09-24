// allowed campus categories
const VALID_CATEGORIES = [
  'Books',
  'Calculators',
  'Lab Equipment',
  'Stationery',
  'Electronics',
  'Academic Accessories',
  'Other',
];

// allowed conditions
const VALID_CONDITIONS = ['New', 'Good', 'Fair', 'Used'];

// clean user object so password hash never leaks out
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// quick check for valid email format
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

module.exports = {
  VALID_CATEGORIES,
  VALID_CONDITIONS,
  sanitizeUser,
  isValidEmail,
};
