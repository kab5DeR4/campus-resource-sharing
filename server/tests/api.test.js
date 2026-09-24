const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const db = require('../src/db/database');

let server;
let baseUrl;

// cookie extractor helper
function getCookieFromHeaders(headers) {
  const setCookie = headers.get('set-cookie');
  if (!setCookie) return '';
  return setCookie.split(';')[0];
}

describe('Campus Resource Sharing Platform API Tests', () => {
  let userA = {
    name: 'Alice Cooper',
    email: `alice_${Date.now()}@campus.edu`,
    password: 'password123',
    campus: 'Engineering North',
    course: 'Mechanical Engineering',
  };
  let userB = {
    name: 'Bob Marley',
    email: `bob_${Date.now()}@campus.edu`,
    password: 'password123',
    campus: 'Engineering North',
    course: 'Computer Science',
  };

  let tokenA = '';
  let cookieA = '';
  let tokenB = '';
  let cookieB = '';
  let userAId = null;
  let userBId = null;

  let testResourceId = null;
  let testRequestId = null;
  let testBorrowingId = null;

  before(async () => {
    // bind to random free port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) server.close();
  });

  // 1. Health check
  it('GET /api/health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });

  // 2. Registration & Login
  it('POST /api/auth/register registers User A and User B', async () => {
    // Register user A
    const resA = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });
    assert.strictEqual(resA.status, 201);
    const dataA = await resA.json();
    assert.ok(dataA.user.id);
    assert.strictEqual(dataA.user.email, userA.email.toLowerCase());
    userAId = dataA.user.id;
    tokenA = dataA.token;
    cookieA = getCookieFromHeaders(resA.headers);

    // Register user B
    const resB = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB),
    });
    assert.strictEqual(resB.status, 201);
    const dataB = await resB.json();
    userBId = dataB.user.id;
    tokenB = dataB.token;
    cookieB = getCookieFromHeaders(resB.headers);
  });

  it('POST /api/auth/register rejects duplicate email', async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });
    assert.strictEqual(res.status, 409);
  });

  it('POST /api/auth/login authenticates registered user', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: userA.password }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.email, userA.email.toLowerCase());
  });

  it('GET /api/auth/me returns current session user', async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: cookieA },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.id, userAId);
  });

  // 3. Resource Creation & Authorization
  it('POST /api/resources creates a new listing by User A', async () => {
    const res = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieA,
      },
      body: JSON.stringify({
        title: 'Texas Instruments Graphing Calculator TI-84',
        description: 'Perfect for numerical methods and linear algebra exams with all battery slots fresh.',
        category: 'Calculators',
        condition: 'Good',
        campus: 'Engineering North',
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.resource.title, 'Texas Instruments Graphing Calculator TI-84');
    assert.strictEqual(data.resource.status, 'AVAILABLE');
    assert.strictEqual(data.resource.owner_id, userAId);
    testResourceId = data.resource.id;
  });

  it('POST /api/resources requires authentication', async () => {
    const res = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorized Item',
        description: 'Should fail without login credentials',
        category: 'Books',
        condition: 'Good',
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  // 4. Resource Browsing & Search
  it('GET /api/resources returns resource with search and category filters', async () => {
    const res = await fetch(`${baseUrl}/resources?search=Graphing&category=Calculators`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.resources.length > 0);
    const found = data.resources.find((r) => r.id === testResourceId);
    assert.ok(found);
  });

  it('GET /api/resources/:id returns single resource with borrower context', async () => {
    const res = await fetch(`${baseUrl}/resources/${testResourceId}`, {
      headers: { Cookie: cookieB },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.resource.id, testResourceId);
    assert.strictEqual(data.isOwner, false);
    assert.strictEqual(data.hasPendingRequest, false);
  });

  // 5. Request Creation & State Transition (AVAILABLE -> REQUESTED)
  it('POST /api/resources/:id/request prevents owner from requesting their own item', async () => {
    const res = await fetch(`${baseUrl}/resources/${testResourceId}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieA, // Alice is owner
      },
      body: JSON.stringify({ message: 'Can I borrow my own stuff?' }),
    });
    assert.strictEqual(res.status, 400);
  });

  it('POST /api/resources/:id/request creates request and sets resource to REQUESTED', async () => {
    const res = await fetch(`${baseUrl}/resources/${testResourceId}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieB, // Bob requests Alice's calculator
      },
      body: JSON.stringify({ message: 'Need it for tomorrow morning lab test!', expected_days: 5 }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.request.status, 'PENDING');
    testRequestId = data.request.id;

    // verify resource status flipped to REQUESTED
    const resCheck = await fetch(`${baseUrl}/resources/${testResourceId}`);
    const checkData = await resCheck.json();
    assert.strictEqual(checkData.resource.status, 'REQUESTED');
  });

  // 6. Duplicate Request Prevention
  it('POST /api/resources/:id/request prevents duplicate request on REQUESTED item', async () => {
    const res = await fetch(`${baseUrl}/resources/${testResourceId}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieB,
      },
      body: JSON.stringify({ message: 'Trying again' }),
    });
    assert.strictEqual(res.status, 400);
  });

  // 7. Incoming Requests for Owner
  it('GET /api/requests/incoming shows pending request for Alice (owner)', async () => {
    const res = await fetch(`${baseUrl}/requests/incoming`, {
      headers: { Cookie: cookieA },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const req = data.requests.find((r) => r.id === testRequestId);
    assert.ok(req);
    assert.strictEqual(req.borrower_id, userBId);
  });

  // 8. Rejection and Status Reset test
  it('PATCH /api/requests/:id/respond rejects request and resets resource to AVAILABLE', async () => {
    // create a temporary second resource to test reject flow
    const tempRes = await fetch(`${baseUrl}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({
        title: 'Temp Rejectable Book',
        description: 'Book solely for testing reject flow integrity.',
        category: 'Books',
        condition: 'Good',
        campus: 'Engineering North',
      }),
    });
    const tempResource = (await tempRes.json()).resource;

    // Bob requests it
    const reqRes = await fetch(`${baseUrl}/resources/${tempResource.id}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
      body: JSON.stringify({ message: 'Please lend' }),
    });
    const tempRequest = (await reqRes.json()).request;

    // Alice rejects it
    const rejectRes = await fetch(`${baseUrl}/requests/${tempRequest.id}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ action: 'reject' }),
    });
    assert.strictEqual(rejectRes.status, 200);

    // Resource should now be AVAILABLE again
    const verifyRes = await fetch(`${baseUrl}/resources/${tempResource.id}`);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.resource.status, 'AVAILABLE');
  });

  // 9. Request Approval & Borrowing Creation (REQUESTED -> UNAVAILABLE, Borrowing = ACTIVE)
  it('PATCH /api/requests/:id/respond approves request and sets resource UNAVAILABLE', async () => {
    // Non-owner should not be able to approve
    const unauthRes = await fetch(`${baseUrl}/requests/${testRequestId}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB }, // Bob is borrower, not owner
      body: JSON.stringify({ action: 'approve' }),
    });
    assert.strictEqual(unauthRes.status, 403);

    // Owner Alice approves
    const approveRes = await fetch(`${baseUrl}/requests/${testRequestId}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ action: 'approve' }),
    });
    assert.strictEqual(approveRes.status, 200);
    const approveData = await approveRes.json();
    assert.ok(approveData.borrowing);
    assert.strictEqual(approveData.borrowing.status, 'ACTIVE');
    testBorrowingId = approveData.borrowing.id;

    // Resource should now be UNAVAILABLE
    const checkRes = await fetch(`${baseUrl}/resources/${testResourceId}`);
    const checkData = await checkRes.json();
    assert.strictEqual(checkData.resource.status, 'UNAVAILABLE');
  });

  // 10. Borrowings List
  it('GET /api/borrowings lists active borrowing for both parties', async () => {
    // Check borrower perspective
    const resB = await fetch(`${baseUrl}/borrowings`, {
      headers: { Cookie: cookieB },
    });
    assert.strictEqual(resB.status, 200);
    const dataB = await resB.json();
    assert.ok(dataB.borrowed.some((b) => b.id === testBorrowingId && b.status === 'ACTIVE'));

    // Check owner perspective
    const resA = await fetch(`${baseUrl}/borrowings`, {
      headers: { Cookie: cookieA },
    });
    assert.strictEqual(resA.status, 200);
    const dataA = await resA.json();
    assert.ok(dataA.lent.some((b) => b.id === testBorrowingId && b.status === 'ACTIVE'));
  });

  // 11. Return Workflow (ACTIVE -> RETURNED, UNAVAILABLE -> AVAILABLE)
  it('PATCH /api/borrowings/:id/return confirms return and sets resource back to AVAILABLE', async () => {
    const returnRes = await fetch(`${baseUrl}/borrowings/${testBorrowingId}/return`, {
      method: 'PATCH',
      headers: { Cookie: cookieA }, // Alice confirms return received
    });
    assert.strictEqual(returnRes.status, 200);
    const returnData = await returnRes.json();
    assert.strictEqual(returnData.borrowing.status, 'RETURNED');
    assert.ok(returnData.borrowing.returned_at);

    // Verify resource is back to AVAILABLE
    const checkRes = await fetch(`${baseUrl}/resources/${testResourceId}`);
    const checkData = await checkRes.json();
    assert.strictEqual(checkData.resource.status, 'AVAILABLE');
  });

  // 12. Dashboard Metrics
  it('GET /api/dashboard returns metrics, lists, and activity feed', async () => {
    const res = await fetch(`${baseUrl}/dashboard`, {
      headers: { Cookie: cookieA },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(typeof data.metrics.myListingsCount === 'number');
    assert.ok(Array.isArray(data.myListings));
    assert.ok(Array.isArray(data.recentActivity));
  });

  // 13. Profile & Stats
  it('GET /api/profile returns user details and transaction stats', async () => {
    const res = await fetch(`${baseUrl}/profile`, {
      headers: { Cookie: cookieA },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.email, userA.email.toLowerCase());
    assert.ok(typeof data.stats.successfulLends === 'number');
  });
});
