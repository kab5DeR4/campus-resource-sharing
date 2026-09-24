-- enable foreign keys
PRAGMA foreign_keys = ON;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  campus TEXT NOT NULL,
  course TEXT,
  bio TEXT,
  avatar_seed TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- resources table
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('Books', 'Calculators', 'Lab Equipment', 'Stationery', 'Electronics', 'Academic Accessories', 'Other')),
  condition TEXT NOT NULL CHECK(condition IN ('New', 'Good', 'Fair', 'Used')),
  campus TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'REQUESTED', 'UNAVAILABLE')),
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- requests table
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  borrower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  expected_days INTEGER DEFAULT 7,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- borrowings table
CREATE TABLE IF NOT EXISTS borrowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  borrower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  borrowed_at TEXT NOT NULL DEFAULT (datetime('now')),
  expected_return_at TEXT,
  returned_at TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'RETURNED'))
);

-- indexes for speedy lookups
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_campus ON resources(campus);
CREATE INDEX IF NOT EXISTS idx_resources_owner ON resources(owner_id);

CREATE INDEX IF NOT EXISTS idx_requests_resource ON requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_requests_borrower ON requests(borrower_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

CREATE INDEX IF NOT EXISTS idx_borrowings_borrower ON borrowings(borrower_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_owner ON borrowings(owner_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);
