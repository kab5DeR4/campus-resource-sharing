const bcrypt = require('bcryptjs');
const db = require('./database');

// drop existing data and reseed fresh with local image assets
function seed() {
  console.log('Seeding campus database with local image assets...');

  db.withTransaction(() => {
    // clear all tables
    db.run('DELETE FROM borrowings');
    db.run('DELETE FROM requests');
    db.run('DELETE FROM resources');
    db.run('DELETE FROM users');

    const passwordHash = bcrypt.hashSync('student123', 10);

    // seed realistic campus students
    const users = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@campus.edu',
        password_hash: passwordHash,
        campus: 'Main Tech Campus',
        course: 'B.Tech Computer Science',
        bio: '3rd year CS student. Sharing coding books, lab electronics, and coursework essentials.',
        avatar_seed: 'aarav',
      },
      {
        name: 'Priya Nair',
        email: 'priya@campus.edu',
        password_hash: passwordHash,
        campus: 'Main Tech Campus',
        course: 'Electronics & Communication',
        bio: 'ECE final year. Got breadboards, lab coats, and engineering calculators up for sharing.',
        avatar_seed: 'priya',
      },
      {
        name: 'Rohan Deshmukh',
        email: 'rohan@campus.edu',
        password_hash: passwordHash,
        campus: 'North Health & Science',
        course: 'Biomedical Science',
        bio: 'Pre-med / bio student. Happy to lend lab coats, bio record manuals, and chemistry kits.',
        avatar_seed: 'rohan',
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@campus.edu',
        password_hash: passwordHash,
        campus: 'South Arts & Design',
        course: 'Applied Mathematics & Data',
        bio: 'Math enthusiast. Lending high-end scientific calculators and stats reference books.',
        avatar_seed: 'sneha',
      },
    ];

    const insertUserStmt = db.db.prepare(`
      INSERT INTO users (name, email, password_hash, campus, course, bio, avatar_seed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const u of users) {
      insertUserStmt.run(u.name, u.email, u.password_hash, u.campus, u.course, u.bio, u.avatar_seed);
    }

    const allUsers = db.all('SELECT id, name, email FROM users');
    const u1 = allUsers[0].id; // Aarav
    const u2 = allUsers[1].id; // Priya
    const u3 = allUsers[2].id; // Rohan
    const u4 = allUsers[3].id; // Sneha

    // seed realistic campus items with 100% offline local project images
    const resources = [
      {
        owner_id: u1,
        title: 'Casio fx-991ES Plus Scientific Calculator',
        description: 'Standard 417-function engineering calculator with two-way power. Excellent for semester exams, matrix operations, and integration.',
        category: 'Calculators',
        condition: 'Good',
        campus: 'Main Tech Campus',
        status: 'AVAILABLE',
        image_url: '/images/calculator.svg',
      },
      {
        owner_id: u1,
        title: 'Engineering Mathematics – Semester III (Higher Engineering Math)',
        description: 'Comprehensive guide covering Laplace transforms, Fourier series, and PDEs. No scribbles on practice problems. CD included.',
        category: 'Books',
        condition: 'Good',
        campus: 'Main Tech Campus',
        status: 'REQUESTED', // Has pending request from Priya
        image_url: '/images/math_book.svg',
      },
      {
        owner_id: u1,
        title: 'USB-C to HDMI & VGA Multi-Port Display Adapter',
        description: 'Crucial for seminar presentations in seminar halls 1 & 2. Supports 4K HDMI and legacy VGA projectors.',
        category: 'Electronics',
        condition: 'New',
        campus: 'Main Tech Campus',
        status: 'AVAILABLE',
        image_url: '/images/usb_adapter.svg',
      },
      {
        owner_id: u2,
        title: 'White Unisex Lab Coat – Size Medium',
        description: 'Clean 100% cotton lab coat required for chemistry, materials science, and biochemistry laboratory sessions.',
        category: 'Lab Equipment',
        condition: 'Good',
        campus: 'Main Tech Campus',
        status: 'AVAILABLE',
        image_url: '/images/lab_coat.svg',
      },
      {
        owner_id: u2,
        title: 'Arduino Uno Starter Hardware Experiment Kit',
        description: 'Includes Uno R3 board, breadboard, jumper wires, ultrasonic sensors, LEDs, resistors, and LCD display module for microcontrollers practicals.',
        category: 'Electronics',
        condition: 'Good',
        campus: 'Main Tech Campus',
        status: 'UNAVAILABLE', // Currently lent to Aarav
        image_url: '/images/arduino_kit.svg',
      },
      {
        owner_id: u2,
        title: 'C & Data Structures Practical Reference Book',
        description: 'Clear algorithmic explanations with visual diagrams for linked lists, binary trees, and sorting algorithms. Great for semester lab vivas.',
        category: 'Books',
        condition: 'Used',
        campus: 'Main Tech Campus',
        status: 'AVAILABLE',
        image_url: '/images/c_book.svg',
      },
      {
        owner_id: u3,
        title: 'Safety Eye Goggles & Splash Protection Mask',
        description: 'OSHA compliant anti-fog laboratory goggles. Mandatory for Organic Chemistry practicals.',
        category: 'Lab Equipment',
        condition: 'New',
        campus: 'North Health & Science',
        status: 'AVAILABLE',
        image_url: '/images/goggles.svg',
      },
      {
        owner_id: u3,
        title: 'Digital Vernier Caliper (0-150mm)',
        description: 'High-precision stainless steel caliper with LCD screen. Accurate to 0.01mm for Physics and Workshop measurements.',
        category: 'Lab Equipment',
        condition: 'Good',
        campus: 'North Health & Science',
        status: 'AVAILABLE',
        image_url: '/images/caliper.svg',
      },
      {
        owner_id: u4,
        title: 'Texas Instruments TI-84 Plus Graphing Calculator',
        description: 'Advanced graphing calculator for Statistics, Numerical Methods, and Calculus. Loaded with python app and linear algebra formulas.',
        category: 'Calculators',
        condition: 'Good',
        campus: 'South Arts & Design',
        status: 'AVAILABLE',
        image_url: '/images/graphing_calc.svg',
      },
      {
        owner_id: u4,
        title: 'Engineering Mini Drafter & Drafting Board Clips',
        description: 'Steel arm mini drafter with clamp. Essential for first-year Engineering Graphics (ED) drawing sheet submissions.',
        category: 'Academic Accessories',
        condition: 'Fair',
        campus: 'South Arts & Design',
        status: 'AVAILABLE',
        image_url: '/images/mini_drafter.svg',
      },
      {
        owner_id: u3,
        title: 'Anatomy & Physiology Color Atlas (8th Edition)',
        description: 'Detailed anatomical diagrams and tissue histology reference guide for biomedical laboratory exams.',
        category: 'Books',
        condition: 'Good',
        campus: 'North Health & Science',
        status: 'AVAILABLE',
        image_url: '/images/anatomy_book.svg',
      },
      {
        owner_id: u1,
        title: 'Dual-Tip Acrylic Marker & Stationery Drafting Set',
        description: 'Set of 24 markers, fine liner pens, geometry compass set, and scale rulers for project charts and poster presentations.',
        category: 'Stationery',
        condition: 'Good',
        campus: 'Main Tech Campus',
        status: 'AVAILABLE',
        image_url: '/images/stationery.svg',
      },
    ];

    const insertResourceStmt = db.db.prepare(`
      INSERT INTO resources (owner_id, title, description, category, condition, campus, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of resources) {
      insertResourceStmt.run(r.owner_id, r.title, r.description, r.category, r.condition, r.campus, r.status, r.image_url);
    }

    const allResources = db.all('SELECT id, title, owner_id, status FROM resources');

    // 1. Pending request: Priya wants Aarav's "Engineering Mathematics – Semester III"
    const mathBook = allResources.find((r) => r.title.includes('Engineering Mathematics'));
    if (mathBook) {
      db.run(
        `INSERT INTO requests (resource_id, borrower_id, message, expected_days, status)
         VALUES (?, ?, ?, ?, ?)`,
        [mathBook.id, u2, 'Hey Aarav! Have my internal exam next Tuesday, would love to borrow this for a week.', 7, 'PENDING']
      );
    }

    // 2. Active borrowing: Aarav borrowed Priya's "Arduino Uno Starter Hardware Experiment Kit"
    const arduino = allResources.find((r) => r.title.includes('Arduino Uno'));
    if (arduino) {
      const reqResult = db.run(
        `INSERT INTO requests (resource_id, borrower_id, message, expected_days, status)
         VALUES (?, ?, ?, ?, ?)`,
        [arduino.id, u1, 'Need this to build our line follower robot practical demo!', 10, 'APPROVED']
      );

      const requestId = Number(reqResult.lastInsertRowid);

      db.run(
        `INSERT INTO borrowings (resource_id, owner_id, borrower_id, request_id, borrowed_at, expected_return_at, status)
         VALUES (?, ?, ?, ?, datetime('now', '-3 days'), datetime('now', '+7 days'), ?)`,
        [arduino.id, u2, u1, requestId, 'ACTIVE']
      );
    }
  });

  console.log('Database seeded successfully with local project images!');
}

if (require.main === module) {
  seed();
}

module.exports = seed;
