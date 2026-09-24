const db = require('../db/database');

// get all borrowings involving the logged-in student (both borrowed and lent)
function getBorrowings(req, res) {
  const userId = req.user.id;

  // items borrowed by the user
  const borrowedItems = db.all(
    `SELECT 
       b.id, b.resource_id, b.owner_id, b.borrower_id, b.request_id,
       b.borrowed_at, b.expected_return_at, b.returned_at, b.status,
       r.title AS resource_title, r.category AS resource_category,
       r.condition AS resource_condition, r.image_url AS resource_image_url,
       u.name AS owner_name, u.email AS owner_email, u.campus AS owner_campus
     FROM borrowings b
     JOIN resources r ON b.resource_id = r.id
     JOIN users u ON b.owner_id = u.id
     WHERE b.borrower_id = ?
     ORDER BY CASE WHEN b.status = 'ACTIVE' THEN 0 ELSE 1 END, b.borrowed_at DESC`,
    [userId]
  );

  // items lent out by the user to others
  const lentItems = db.all(
    `SELECT 
       b.id, b.resource_id, b.owner_id, b.borrower_id, b.request_id,
       b.borrowed_at, b.expected_return_at, b.returned_at, b.status,
       r.title AS resource_title, r.category AS resource_category,
       r.condition AS resource_condition, r.image_url AS resource_image_url,
       u.name AS borrower_name, u.email AS borrower_email, u.campus AS borrower_campus,
       u.course AS borrower_course
     FROM borrowings b
     JOIN resources r ON b.resource_id = r.id
     JOIN users u ON b.borrower_id = u.id
     WHERE b.owner_id = ?
     ORDER BY CASE WHEN b.status = 'ACTIVE' THEN 0 ELSE 1 END, b.borrowed_at DESC`,
    [userId]
  );

  return res.json({
    borrowed: borrowedItems,
    lent: lentItems,
  });
}

// return workflow: owner confirms return or borrower returns
function confirmReturn(req, res) {
  const borrowingId = Number(req.params.id);

  const borrowing = db.get('SELECT * FROM borrowings WHERE id = ?', [borrowingId]);
  if (!borrowing) {
    return res.status(404).json({ error: 'Borrowing record not found' });
  }

  if (borrowing.status !== 'ACTIVE') {
    return res.status(400).json({ error: `Cannot return an item that is already marked as ${borrowing.status.toLowerCase()}` });
  }

  // verify permission: owner confirms return, or borrower marks it returned
  // for strict integrity: only owner can confirm receipt of return, or either party with owner confirmation
  const isOwner = borrowing.owner_id === req.user.id;
  const isBorrower = borrowing.borrower_id === req.user.id;

  if (!isOwner && !isBorrower) {
    return res.status(403).json({ error: 'You are not involved in this borrowing transaction' });
  }

  // atomic return transition
  db.withTransaction(() => {
    // 1. Mark borrowing as RETURNED
    db.run(
      `UPDATE borrowings 
       SET status = 'RETURNED', returned_at = datetime('now') 
       WHERE id = ?`,
      [borrowingId]
    );

    // 2. Mark resource back as AVAILABLE
    db.run(
      `UPDATE resources 
       SET status = 'AVAILABLE', updated_at = datetime('now') 
       WHERE id = ?`,
      [borrowing.resource_id]
    );
  });

  const updatedBorrowing = db.get('SELECT * FROM borrowings WHERE id = ?', [borrowingId]);

  return res.json({
    message: isOwner ? 'Return confirmed! The item is back in circulation as available.' : 'Item marked returned! Owner can confirm receipt.',
    borrowing: updatedBorrowing,
  });
}

module.exports = {
  getBorrowings,
  confirmReturn,
};
