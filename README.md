# Campus Resource Sharing Platform

A localized peer-to-peer campus marketplace where university students can lend, share, request, borrow, and return essential academic resources such as textbooks, scientific calculators, lab coats, and coursework electronics.

Built with professional product thinking, restrained design, and strict backend state integrity.

---

## 1. Core Workflow & Inventory Lifecycle

The application enforces a clear separation between **Resource State** and **Request / Borrowing State**:

```text
[AVAILABLE] ──(Student requests)──> [REQUESTED] ──(Owner approves)──> [UNAVAILABLE] ──(Return confirmed)──> [AVAILABLE]
                                         │
                                   (Owner rejects
                                    or cancels)
                                         │
                                         ▼
                                    [AVAILABLE]
```

### State Transitions Table

| Action | Resource State | Request State | Borrowing State | Performed By |
| :--- | :--- | :--- | :--- | :--- |
| **List Resource** | `AVAILABLE` | — | — | Owner |
| **Submit Borrow Request** | `REQUESTED` | `PENDING` | — | Borrower |
| **Reject Request** | `AVAILABLE` | `REJECTED` | — | Owner |
| **Cancel Request** | `AVAILABLE` | `CANCELLED` | — | Borrower |
| **Approve Request** | `UNAVAILABLE` | `APPROVED` | `ACTIVE` | Owner |
| **Confirm Return** | `AVAILABLE` | — | `RETURNED` | Owner |

*All multi-row updates run inside SQLite ACID transactions (`BEGIN IMMEDIATE ... COMMIT/ROLLBACK`).*

---

## 2. Technology Stack

- **Frontend**: React 19, Vite, Lucide Icons, Modern Responsive CSS / CSS Modules
- **Backend**: Node.js 24, Express.js REST API
- **Database**: SQLite (built-in `node:sqlite` `DatabaseSync` engine with WAL mode and foreign key enforcement)
- **Authentication**: HTTP-only secure cookie session, JSON Web Tokens (JWT), bcrypt password hashing
- **Testing**: Node.js native test runner (`node:test`, `node:assert`)

---

## 3. Project Structure

```text
campus-resource-sharing/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DemoSwitcher.jsx      # 1-click test student switcher
│   │   │   ├── EmptyState.jsx        # Accessible zero-data indicators
│   │   │   ├── Footer.jsx            # Restrained campus footer
│   │   │   ├── Modal.jsx             # Accessible confirmation dialogs
│   │   │   ├── Navbar.jsx            # Sticky responsive navigation
│   │   │   ├── ResourceCard.jsx      # Marketplace catalog card
│   │   │   └── StatusBadge.jsx       # Color-coded lifecycle indicators
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Student session & quick demo switcher
│   │   │   └── ToastContext.jsx      # Toast notifications
│   │   ├── pages/
│   │   │   ├── BrowsePage.jsx        # Search, filters (category/campus/condition)
│   │   │   ├── CreateListingPage.jsx # Streamlined 5-field resource listing
│   │   │   ├── DashboardPage.jsx     # Workspace: incoming, requests, borrowings, activity
│   │   │   ├── EditListingPage.jsx   # Edit resource details
│   │   │   ├── HomePage.jsx          # Purposeful landing & category guide
│   │   │   ├── LoginPage.jsx         # Sign in + 1-click demo accounts
│   │   │   ├── ProfilePage.jsx       # Student profile & borrow/lend stats
│   │   │   └── ResourceDetailPage.jsx# Full details & dynamic action box
│   │   ├── services/
│   │   │   └── api.js                # Fetch API client with credentials
│   │   └── styles/
│   │       └── index.css             # Restrained design system & mobile queries
│   └── vite.config.js               # Proxy setup (/api -> localhost:5000)
├── server/
│   ├── data/                         # Persistent SQLite database storage
│   ├── src/
│   │   ├── controllers/              # REST endpoint logic & validation
│   │   ├── db/
│   │   │   ├── database.js           # DatabaseSync instance & transaction helper
│   │   │   ├── schema.sql            # Table definitions, constraints, indexes
│   │   │   └── seed.js               # Believable campus student & item data
│   │   ├── middleware/               # Auth guards & centralized error handler
│   │   ├── routes/                   # Clean Express router modules
│   │   ├── utils/                    # JWT signing & helper validation
│   │   ├── app.js                    # Express app configuration & static server
│   │   └── server.js                 # HTTP listener
│   └── tests/
│       └── api.test.js               # 19 automated integration tests
├── package.json                      # Root scripts (concurrently dev runner)
└── README.md
```

---

## 4. Quick Start & Setup

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### 1. Install Dependencies

From the project root:
```bash
# install root dependencies
npm install

# install server dependencies
cd server && npm install && cd ..

# install client dependencies
cd client && npm install && cd ..
```

### 2. Seed Database
Populates believable student accounts, textbooks, lab equipment, and sample live workflow states:
```bash
npm run seed
```

### 3. Run Development Servers
Starts both the Express backend (`http://localhost:5000`) and the Vite client (`http://localhost:5173`):
```bash
npm run dev
```

Alternatively, run individually:
```bash
# Terminal 1: Backend API
npm run server:dev

# Terminal 2: Frontend Client
npm run client
```

Open `http://localhost:5173` in your browser.

---

## 5. Seeded Demo Accounts (Password: `student123`)

The top bar features an **instant 1-click test student switcher** to evaluate the complete lending and borrowing workflow between peers:

| Student | Email | Role in Demo Workflow |
| :--- | :--- | :--- |
| **Aarav Sharma** | `aarav@campus.edu` | Has an **incoming pending request** from Priya for his Math book; currently borrowing Priya's Arduino kit. |
| **Priya Nair** | `priya@campus.edu` | Requester of Aarav's Math book; owner of the actively lent Arduino kit. |
| **Rohan Deshmukh** | `rohan@campus.edu` | Pre-med student with lab coats, safety goggles, and Vernier calipers. |
| **Sneha Patel** | `sneha@campus.edu` | Applied Math student with TI-84 Plus graphing calculator and drawing tools. |

---

## 6. Testing the Complete Cycle (Definition of Done)

1. Open `http://localhost:5173`.
2. Click **Aarav** on the top switcher.
3. Go to **Dashboard** &rarr; see **Incoming Requests** tab &rarr; Click **Approve** on Priya's request for *Engineering Mathematics*.
4. Notice the resource status immediately switches to **UNAVAILABLE** and a new active borrowing is logged.
5. Click **Priya** on the top switcher.
6. Open **Dashboard** &rarr; **Borrowing & Lent** tab &rarr; Priya sees *Engineering Mathematics* in **Items You Are Borrowing**.
7. Click **Aarav** again.
8. Go to **Dashboard** &rarr; **Borrowing & Lent** tab &rarr; click **Confirm Return Received**.
9. The borrowing status transitions to **RETURNED** and the textbook is immediately back to **AVAILABLE** in the catalog.

---

## 7. Automated Test Suite

Run the full integration test suite testing all business rules, authorization checks, duplicate prevention, and state transitions:

```bash
npm test
```

### What is tested:
- `POST /api/auth/register` (user registration & password hashing)
- `POST /api/auth/register` duplicate email rejection (409)
- `POST /api/auth/login` and HTTP-only cookie issuance
- `GET /api/auth/me` session validation
- `POST /api/resources` listing creation & authentication guard
- `GET /api/resources` text search, category, condition, campus filtering
- `GET /api/resources/:id` single item detail & borrower context
- `POST /api/resources/:id/request` self-borrowing prevention
- `POST /api/resources/:id/request` atomic state transition to `REQUESTED`
- `POST /api/resources/:id/request` duplicate request prevention
- `GET /api/requests/incoming` owner incoming requests view
- `PATCH /api/requests/:id/respond` reject flow resetting item to `AVAILABLE`
- `PATCH /api/requests/:id/respond` approval authorization & transition to `UNAVAILABLE`
- `GET /api/borrowings` active transactions for both parties
- `PATCH /api/borrowings/:id/return` return confirmation restoring item to `AVAILABLE`
- `GET /api/dashboard` aggregated metrics & activity feed
- `GET /api/profile` student record & transaction statistics

---

## 8. REST API Reference

### Authentication
- `POST /api/auth/register` - Create student account
- `POST /api/auth/login` - Sign in & issue HTTP-only cookie
- `POST /api/auth/logout` - Clear auth session cookie
- `GET  /api/auth/me` - Get current session user

### Resources
- `GET    /api/resources` - Search & filter catalog (`search`, `category`, `condition`, `campus`, `status`, `sort`)
- `GET    /api/resources/:id` - Resource details with owner & borrower status
- `POST   /api/resources` - Create listing (auth required)
- `PATCH  /api/resources/:id` - Update listing (owner only)
- `DELETE /api/resources/:id` - Delete listing (owner only, prevented if borrowed/requested)
- `POST   /api/resources/:id/request` - Submit borrowing request

### Requests
- `GET   /api/requests` - Student's submitted requests
- `GET   /api/requests/incoming` - Incoming requests for student's listings
- `PATCH /api/requests/:id/respond` - Approve or reject (`{ action: 'approve' | 'reject' }`)
- `PATCH /api/requests/:id/cancel` - Cancel submitted request (borrower only)

### Borrowings
- `GET   /api/borrowings` - List user's borrowed items and lent items
- `PATCH /api/borrowings/:id/return` - Confirm return handover (owner/borrower)

### Dashboard & Profile
- `GET   /api/dashboard` - Aggregated counts, lists, and activity feed
- `GET   /api/profile` - Current user profile and activity stats
- `GET   /api/profile/:id` - Public student profile
- `PATCH /api/profile` - Update profile bio, campus, course, name
