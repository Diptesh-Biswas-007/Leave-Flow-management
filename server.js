// ══════════════════════════════════════════
//   LeaveFlow — Backend Server
//   Run: node server.js
//   Then open: http://localhost:3000
// ══════════════════════════════════════════

const express  = require('express');
const session  = require('express-session');
const path     = require('path');

const app  = express();
const PORT = 3000;

// ── In-memory user store (persists while server is running) ──
// Seeded with one demo account so it works out of the box
const USERS = [
  {
    name:       'Diptesh Biswas',
    empId:      'EMP-1042',
    email:      'test@gmail.com',
    department: 'Engineering',
    role:       'Software Engineer',
    password:   'test1234',
  }
];

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret:            'leaveflow-secret-key',
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
}));

// Serve all static files (HTML, CSS, JS) from this folder
app.use(express.static(path.join(__dirname)));

// ── Auth guard ──
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/');
}

// ══════════════════════════════
//  ROUTES
// ══════════════════════════════

// Root → login
app.get('/', (req, res) => {
  if (req.session && req.session.loggedIn) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Signup page
app.get('/signup', (req, res) => {
  if (req.session && req.session.loggedIn) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Dashboard — protected
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ══════════════════════════════
//  API — LOGIN
// ══════════════════════════════
app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res.status(400).json({ success: false, message: 'All fields are required.' });

  const id = identifier.trim().toLowerCase();

  // Match by email OR by Employee ID (case-insensitive)
  const user = USERS.find(u =>
    (u.email.toLowerCase() === id || u.empId.toLowerCase() === id) &&
    u.password === password
  );

  if (user) {
    req.session.loggedIn = true;
    req.session.user     = {
      name:       user.name,
      empId:      user.empId,
      role:       user.role,
      department: user.department,
      email:      user.email,
    };
    return res.json({ success: true, redirect: '/dashboard' });
  }

  res.status(401).json({ success: false, message: 'Invalid email or password.' });
});

// ══════════════════════════════
//  API — SIGNUP
// ══════════════════════════════
app.post('/api/signup', (req, res) => {
  const { name, empId, email, department, role, password } = req.body;

  // Basic server-side validation
  if (!name || !empId || !email || !department || !role || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  // Check for duplicate email
  const emailExists = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  // Check for duplicate Employee ID
  const empIdExists = USERS.find(u => u.empId.toUpperCase() === empId.toUpperCase());
  if (empIdExists) {
    return res.status(409).json({ success: false, message: 'This Employee ID is already registered.' });
  }

  // Save new user
  USERS.push({ name, empId: empId.toUpperCase(), email: email.toLowerCase(), department, role, password });

  console.log(`  ✓ New user registered: ${name} (${email})`);

  return res.json({ success: true, message: 'Account created successfully.' });
});

// ══════════════════════════════
//  API — CURRENT USER
// ══════════════════════════════
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.session.user });
});

// ══════════════════════════════
//  API — LOGOUT
// ══════════════════════════════
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║   LeaveFlow running on port ${PORT}     ║`);
  console.log(`  ║   http://localhost:${PORT}              ║`);
  console.log(`  ╠══════════════════════════════════════╣`);
  console.log(`  ║   Demo login: test@gmail.com         ║`);
  console.log(`  ║   Password:   test1234               ║`);
  console.log(`  ║   Or sign up at /signup              ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});
