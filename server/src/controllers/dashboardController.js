const db = require('../db/database');

// fetch student dashboard metrics, lists, and activity feed
function getDashboard(req, res) {
  const userId = req.user.id;

  // 1. My listings count & list
  const myListings = db.all(
    `SELECT id, title, category, condition, campus, status, image_url, created_at
     FROM resources
     WHERE owner_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  // 2. Incoming pending requests (requests waiting for user's approval)
  const incomingPending = db.all(
    `SELECT 
       req.id, req.resource_id, req.borrower_id, req.message, req.expected_days,
       req.status, req.created_at,
       r.title AS resource_title, r.category AS resource_category,
       u.name AS borrower_name, u.campus AS borrower_campus, u.course AS borrower_course
     FROM requests req
     JOIN resources r ON req.resource_id = r.id
     JOIN users u ON req.borrower_id = u.id
     WHERE r.owner_id = ? AND req.status = 'PENDING'
     ORDER BY req.created_at DESC`,
    [userId]
  );

  // 3. My submitted requests
  const myRequests = db.all(
    `SELECT 
       req.id, req.resource_id, req.message, req.expected_days, req.status, req.created_at,
       r.title AS resource_title, r.category AS resource_category, r.status AS resource_status,
       u.name AS owner_name, u.campus AS owner_campus
     FROM requests req
     JOIN resources r ON req.resource_id = r.id
     JOIN users u ON r.owner_id = u.id
     WHERE req.borrower_id = ?
     ORDER BY req.created_at DESC`,
    [userId]
  );

  // 4. Current borrowings where user is the borrower
  const activeBorrowings = db.all(
    `SELECT 
       b.id, b.resource_id, b.borrowed_at, b.expected_return_at, b.status,
       r.title AS resource_title, r.category AS resource_category, r.image_url,
       u.name AS owner_name, u.email AS owner_email, u.campus AS owner_campus
     FROM borrowings b
     JOIN resources r ON b.resource_id = r.id
     JOIN users u ON b.owner_id = u.id
     WHERE b.borrower_id = ? AND b.status = 'ACTIVE'
     ORDER BY b.borrowed_at DESC`,
    [userId]
  );

  // 5. Current lent items where user is the lender
  const activeLent = db.all(
    `SELECT 
       b.id, b.resource_id, b.borrowed_at, b.expected_return_at, b.status,
       r.title AS resource_title, r.category AS resource_category, r.image_url,
       u.name AS borrower_name, u.email AS borrower_email, u.campus AS borrower_campus
     FROM borrowings b
     JOIN resources r ON b.resource_id = r.id
     JOIN users u ON b.borrower_id = u.id
     WHERE b.owner_id = ? AND b.status = 'ACTIVE'
     ORDER BY b.borrowed_at DESC`,
    [userId]
  );

  // 6. Recent activity feed (chronological event stream)
  // Combine recent listings, requests, borrowings into one clean list
  const activity = [];

  // Recent listings by user
  myListings.slice(0, 5).forEach((item) => {
    activity.push({
      id: `list-${item.id}`,
      type: 'LISTING_CREATED',
      title: `You listed "${item.title}"`,
      timestamp: item.created_at,
      status: item.status,
      link: `/resources/${item.id}`,
    });
  });

  // Incoming requests
  incomingPending.slice(0, 5).forEach((req) => {
    activity.push({
      id: `inreq-${req.id}`,
      type: 'REQUEST_RECEIVED',
      title: `${req.borrower_name} requested "${req.resource_title}"`,
      timestamp: req.created_at,
      status: req.status,
      link: `/dashboard?tab=incoming`,
    });
  });

  // Active borrowings
  activeBorrowings.slice(0, 5).forEach((b) => {
    activity.push({
      id: `borrow-${b.id}`,
      type: 'ITEM_BORROWED',
      title: `Borrowing "${b.resource_title}" from ${b.owner_name}`,
      timestamp: b.borrowed_at,
      status: b.status,
      link: `/dashboard?tab=borrowing`,
    });
  });

  // Active lent items
  activeLent.slice(0, 5).forEach((l) => {
    activity.push({
      id: `lent-${l.id}`,
      type: 'ITEM_LENT',
      title: `Lent "${l.resource_title}" to ${l.borrower_name}`,
      timestamp: l.borrowed_at,
      status: l.status,
      link: `/dashboard?tab=lent`,
    });
  });

  // sort activity by timestamp desc
  activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return res.json({
    metrics: {
      myListingsCount: myListings.length,
      incomingPendingCount: incomingPending.length,
      myRequestsCount: myRequests.filter((r) => r.status === 'PENDING').length,
      activeBorrowingsCount: activeBorrowings.length,
      activeLentCount: activeLent.length,
    },
    myListings,
    incomingPending,
    myRequests,
    activeBorrowings,
    activeLent,
    recentActivity: activity.slice(0, 8),
  });
}

module.exports = {
  getDashboard,
};
